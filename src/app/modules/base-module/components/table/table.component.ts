import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import {
  ModuleBase,
  ModuleBaseReadRequest,
  ModuleBaseResponse,
} from '../../types/module-base.type';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from '../../../../services/company.service';
import { SortType } from '../../types/soring.type';
import { PaginationType } from '../../types/pagination.type';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { combineLatest, takeUntil, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Modules } from '../../../../constants/modules';
import { MatColumnDef, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<B extends ModuleBaseResponse, F extends ModuleBase>
  implements OnInit, AfterContentInit, OnDestroy
{
  constructor(
    public http: HttpClient,
    public companyService: CompanyService,
    public cdr: ChangeDetectorRef,
    public router: Router,
  ) {
    this.companyService.companyChanged$
      .pipe(
        tap(() => {
          this.fetch();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  data: F[] = [];
  sorting?: SortType;
  pagination: PaginationType = {
    page: 1,
    limit: 5,
  };
  loading = false;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild('defaultColumns', { read: ElementRef })
  defaultColumns?: ElementRef;

  @Input()
  toDto!: (item: B) => F;

  @Input()
  module!: Modules;

  @Input()
  moduleName!: string;

  @Input()
  moduleItemName!: string;

  @Input()
  displayedColumns: string[] = [];

  ngOnInit() {
    this.fetch();
  }

  @ViewChild(MatTable, { static: true }) table!: MatTable<F>;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef> =
    new QueryList<MatColumnDef>();

  ngAfterContentInit() {
    this.columnDefs.forEach((columnDef) => this.table.addColumnDef(columnDef));
  }

  externalSortChange(sortState: Sort) {
    this.sort.direction = '';
    this.sort.sort({
      id: sortState.active,
      start: sortState.direction,
      disableClear: false,
    });
  }

  sortChange(sortState: Sort) {
    if (sortState.direction) {
      this.sorting = {
        field: sortState.active,
        dir: sortState.direction,
      };
    } else {
      this.sorting = undefined;
    }

    this.fetch();
  }

  pageChange(pageChange: PageEvent) {
    this.pagination = {
      page: pageChange.pageIndex + 1,
      limit: pageChange.pageSize,
    };

    this.fetch();
  }

  fetch() {
    const body: ModuleBaseReadRequest = {
      company_id: this.companyService.selectedCompany?.id,
    };
    if (this.sorting) {
      body.sort = this.sorting;
    }
    if (this.pagination) {
      body.pagination = this.pagination;
    }

    this.loading = true;

    combineLatest([
      this.http.post(`${environment.apiUrl}/api/v1/${this.module}/read`, body),
      this.http.post(`${environment.apiUrl}/api/v1/${this.module}/read`, {
        ...body,
        count: true,
      }),
    ]).subscribe({
      next: ([dataResponse, countResponse]) => {
        const data = dataResponse as B[];
        const count = Number(countResponse as string);
        this.data = data.map((item) => this.toDto(item));
        this.paginator.length = count;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  delete(item: F) {
    this.http
      .delete(
        `${environment.apiUrl}/api/v1/${this.module}/delete/${item.id}?company_id=${this.companyService.selectedCompany?.id}`,
      )
      .subscribe(() => {
        this.fetch();
      });
  }

  destroy$ = new EventEmitter<void>();

  ngOnDestroy() {
    this.destroy$.emit();
  }

  openUpdatePage(item: F) {
    this.router.navigateByUrl(`${location.pathname}/update/${item.id}`, {
      state: {
        item,
      },
    });
  }
}
