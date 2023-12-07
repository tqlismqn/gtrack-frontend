import { AdminModules, Modules } from '../../../constants/modules';
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable } from 'rxjs';
import { SseService } from '../../../services/sse.service';
import { ModuleBaseReadRequest } from '../types/module-base.type';
import { environment } from '../../../../environments/environment';
import { CompanyService } from '../../../services/company.service';
import { Router } from '@angular/router';

@Injectable()
export class BaseModuleServiceDeps {
  constructor(
    public http: HttpClient,
    public sse: SseService,
    public companyService: CompanyService,
    public router: Router,
  ) {}
}

export abstract class BaseModuleService<
  B extends { id: string },
  F extends { id: string },
> {
  data: F[] = [];
  data$ = new EventEmitter<F[]>();

  count = 0;

  item?: F;
  item$ = new EventEmitter<F>();

  module!: Modules | AdminModules;

  abstract moduleName: string;
  abstract moduleItemName: string;
  abstract moduleFieldNames: Record<string, string>;

  created$ = new EventEmitter<string>();
  updated$ = new EventEmitter<string>();
  deleted$ = new EventEmitter<string>();

  constructor(
    protected deps: BaseModuleServiceDeps,
    module: Modules | AdminModules,
  ) {
    this.module = module;

    if (this.deps.sse.init) {
      this.sseInit();
    } else {
      this.deps.sse.init$.subscribe(() => {
        this.sseInit();
      });
    }
  }

  get isAdminModule() {
    return this.module.indexOf('admin/') > -1;
  }

  sseInitAdminModule() {
    const path = this.module.replace('admin/', '');

    this.deps.sse.echo
      .private(`${path}`)
      .listen('.App\\Events\\Model\\ModelUpdate', (data: { id: string }) => {
        this.processUpdate(data.id);
      })
      .listen('.App\\Events\\Model\\ModelCreate', (data: { id: string }) => {
        this.processCreate(data.id);
      })
      .listen('.App\\Events\\Model\\ModelDelete', (data: { id: string }) => {
        this.processDelete(data.id);
      });
  }

  sseInitModule() {
    this.deps.sse.echo
      .private(`${this.module}.${this.companyId}`)
      .listen(
        '.App\\Events\\Model\\Module\\ModelModuleUpdate',
        (data: { id: string }) => {
          this.processUpdate(data.id);
          this.updated$.emit(data.id);
        },
      )
      .listen(
        '.App\\Events\\Model\\Module\\ModelModuleCreate',
        (data: { id: string }) => {
          this.processCreate(data.id);
          this.created$.emit(data.id);
        },
      )
      .listen(
        '.App\\Events\\Model\\Module\\ModelModuleDelete',
        (data: { id: string }) => {
          this.processDelete(data.id);
          this.deleted$.emit(data.id);
        },
      );
  }

  sseInit() {
    if (this.isAdminModule) {
      this.sseInitAdminModule();
    } else {
      this.sseInitModule();
    }
  }

  processUpdate(id: string) {
    if (this.data.findIndex((item) => item.id === id) > -1) {
      this.read().subscribe();
    }
    if (this.item?.id === id) {
      this.readOne(id).subscribe();
    }
  }

  processCreate(id: string) {
    this.read().subscribe();
  }

  processDelete(id: string) {
    this.processInternalDelete(id);
  }

  abstract toDto: (item: B) => F;

  public get companyId() {
    return this.deps.companyService.selectedCompany?.id;
  }

  cachedReadBody?: ModuleBaseReadRequest;

  read(
    body: ModuleBaseReadRequest | undefined = this.cachedReadBody,
    saveData = true,
  ): Observable<[F[], number]> {
    if (saveData) {
      this.cachedReadBody = body;
    }

    if (body) {
      body.company_id = this.companyId;
    }

    return new Observable<[F[], number]>((subscriber) => {
      combineLatest([
        this.deps.http.post(
          `${environment.apiUrl}/api/v1/${this.module}/read?company_id=${this.companyId}`,
          body,
        ),
        this.deps.http.post(
          `${environment.apiUrl}/api/v1/${this.module}/read?company_id=${this.companyId}`,
          {
            ...body,
            count: true,
          },
        ),
      ]).subscribe({
        next: ([dataResponse, countResponse]) => {
          const data = dataResponse as B[];
          const fData = data.map((item) => this.toDto(item));
          const count = Number(countResponse as string);
          if (saveData) {
            this.count = count;
            this.data = fData;
            this.data$.emit(fData);
          }
          subscriber.next([fData, count]);
        },
        error: (err) => {
          subscriber.error(err);
          subscriber.complete();
        },
      });
    });
  }

  readOne(id: number | string, saveData = true): Observable<F> {
    return new Observable<F>((subscriber) => {
      this.deps.http
        .get(
          `${environment.apiUrl}/api/v1/${this.module}/read/${id}?company_id=${this.companyId}`,
        )
        .subscribe({
          next: (response) => {
            const data = response as B;
            const item = this.toDto(data);
            if (saveData) {
              this.item = item;
              this.item$.emit(this.item);
            }
            subscriber.next(item);
          },
          error: (err) => {
            subscriber.error(err);
            subscriber.complete();
          },
        });
    });
  }

  update(data: any, id?: number | string): Observable<F> {
    return new Observable<F>((subscriber) => {
      this.deps.http
        .patch(
          `${environment.apiUrl}/api/v1/${this.module}/update/${
            id ?? this.item?.id
          }?company_id=${this.companyId}`,
          data,
        )
        .subscribe({
          next: (response) => {
            const item = response as B;
            this.item = this.toDto(item);
            this.item$.emit(this.item);

            const itemIndex = this.data.findIndex((item) => item.id === id);
            if (itemIndex > -1) {
              this.data[itemIndex] = this.item;
              this.data = [...this.data];
              this.data$.emit();
            }

            subscriber.next(this.item);
            subscriber.complete();
          },
          error: (err) => {
            subscriber.error(err);
            subscriber.complete();
          },
        });
    });
  }

  create(data: any) {
    return new Observable<F>((subscriber) => {
      this.deps.http
        .post(
          `${environment.apiUrl}/api/v1/${this.module}/create?company_id=${this.companyId}`,
          data,
        )
        .subscribe({
          next: (response) => {
            const item = response as B;
            this.item = this.toDto(item);
            this.item$.emit(this.item);
            subscriber.next(this.item);
            subscriber.complete();
          },
          error: (err) => {
            subscriber.error(err);
            subscriber.complete();
          },
        });
    });
  }

  protected processInternalDelete(id: number | string) {
    if (this.data.findIndex((item) => item.id === id) > -1) {
      this.read().subscribe();
    }
    if (this.item?.id === id) {
      this.item = undefined;
      if (this.deps.router.url.includes(`/update/${id}`)) {
        this.deps.router.navigateByUrl(
          this.deps.router.url.replace(`/update/${id}`, ''),
        );
      }
    }
  }

  delete(id: number | string): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.deps.http
        .delete(
          `${environment.apiUrl}/api/v1/${this.module}/delete/${id}?company_id=${this.companyId}`,
        )
        .subscribe({
          next: () => {
            this.processInternalDelete(id);
            subscriber.next();
            subscriber.complete();
          },
          error: (err) => {
            subscriber.error(err);
            subscriber.complete();
          },
        });
    });
  }
}
