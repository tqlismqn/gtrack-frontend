import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Company, CompanyResponse } from '../types/company.type';
import { environment } from '../../environments/environment';
import { combineLatest, Observable } from 'rxjs';
import { Permission, PermissionResponse } from '../types/permission.type';
import { Modules } from '../constants/modules';
import {
  PermissionAccess,
  PermissionAccessType,
} from '../constants/permission-access';
import { Nameable } from '../modules/base-module/types/nameable.type';
import { SseService } from './sse.service';
import WavePrivateChannel from 'laravel-wave/dist/echo-broadcaster/wave-private-channel';
import { Currencies } from "../types/currencies";

@Injectable({ providedIn: 'root' })
export class CompanyService {
  companies: Company[] = [];
  ownCompanies: Company[] = [];
  permissions: Permission[] = [];
  selectedCompany?: Company;
  selectedPermissions?: Permission[];

  companyChanged$ = new EventEmitter<Company>();
  companiesUpdated$ = new EventEmitter<void>();

  constructor(
    protected http: HttpClient,
    protected sse: SseService,
  ) {}

  get currencies() {
    return this.selectedCompany?.currencies;
  }

  protected fetchCompanies(): Observable<Company[]> {
    return new Observable<Company[]>((subscriber) => {
      this.http.get(`${environment.apiUrl}/api/v1/companies`).subscribe({
        next: (response) => {
          this.companies = response as CompanyResponse[];
          this.ownCompanies = this.companies.filter((item) => item.owner);
          this.companiesUpdated$.emit();
          subscriber.next(this.companies);
          subscriber.complete();
        },
        error: (err) => {
          subscriber.error(err);
          subscriber.complete();
        },
      });
    });
  }

  protected fetchPermissions(): Observable<Permission[]> {
    return new Observable<Permission[]>((subscriber) => {
      this.http.get(`${environment.apiUrl}/api/v1/permissions`).subscribe({
        next: (response) => {
          this.permissions = response as PermissionResponse[];
          subscriber.next(this.permissions);
          subscriber.complete();
        },
        error: (err) => {
          subscriber.error(err);
          subscriber.complete();
        },
      });
    });
  }

  fetch(): Observable<[Company[], Permission[]]> {
    return new Observable<[Company[], Permission[]]>((subscriber) => {
      combineLatest([this.fetchCompanies(), this.fetchPermissions()]).subscribe(
        {
          next: (value) => {
            this.selectDefaultCompany();

            subscriber.next(value);
            subscriber.complete();
          },
          error: (err) => {
            subscriber.error(err);
            subscriber.complete();
          },
        },
      );
    });
  }

  selectCompanyById(id: string): boolean {
    const company = this.companies.find((item) => item.id === id);
    if (company) {
      this.selectedCompany = company;
      this.selectPermissions();
      this.companyChanged$.emit(company);
      localStorage.setItem(
        CompanyService.selectedCompanyKey,
        this.selectedCompany.id.toString(),
      );
      this.sseInit();
      return true;
    }

    return false;
  }
  test(
    to: Currencies
  ) {
    if (this.currencies) {
      const findCurrencies : any = this.currencies.find((currency: any) => currency.ID === to);
      console.log(findCurrencies.rate);
    }
  }
  selectFirstCompany(): boolean {
    if (this.companies.length === 0) {
      return false;
    }

    this.selectedCompany = this.companies[0];
    this.selectPermissions();
    this.companyChanged$.emit(this.selectedCompany);
    localStorage.setItem(
      CompanyService.selectedCompanyKey,
      this.selectedCompany.id.toString(),
    );
    this.sseInit();
    return true;
  }

  protected selectPermissions() {
    const permissions = this.permissions.filter(
      (item) => item.company_id === this.selectedCompany?.id,
    );
    if (permissions) {
      this.selectedPermissions = permissions;
    }
  }

  selectDefaultCompany() {
    const storedId = String(
      localStorage.getItem(CompanyService.selectedCompanyKey),
    );

    if (!this.selectCompanyById(String(storedId))) {
      this.selectFirstCompany();
    }
  }

  haveAnyAccessTo(module: Modules, accessType: PermissionAccessType) {
    const permission = this.selectedPermissions?.find(
      (item) => item.module_id === module,
    );

    if (!permission) {
      return false;
    }

    const access: PermissionAccess = permission[accessType];

    return access !== PermissionAccess.ACCESS_NONE;
  }

  getUserSelections(): Observable<Nameable[]> {
    return new Observable<Nameable[]>((subscriber) => {
      this.http
        .get(
          `${environment.apiUrl}/api/v1/companies/user-names?company_id=${this.selectedCompany?.id}`,
        )
        .subscribe({
          next: (response) => {
            subscriber.next(response as Nameable[]);
            subscriber.complete();
          },
          error: (err) => {
            subscriber.error(err);
            subscriber.complete();
          },
        });
    });
  }

  updateCompaniesLocally(company: Company) {
    let updated = false;

    let index = this.companies.findIndex((item) => item.id === company.id);
    if (index > -1) {
      this.companies[index] = company;
      this.companies = [...this.companies];
      updated = true;
    }

    index = this.ownCompanies.findIndex((item) => item.id === company.id);
    if (index > -1) {
      this.ownCompanies[index] = company;
      this.ownCompanies = [...this.ownCompanies];
      updated = true;
    }

    if (this.selectedCompany?.id === company.id) {
      this.selectedCompany = company;
      updated = true;
    }

    if (updated) {
      this.companiesUpdated$.emit();
    }
  }

  public getRate(currency: Currencies) {
    const findCurrency: any = this.currencies?.find((findCurrency: any) => findCurrency.ID === currency);
    return Number(findCurrency.rate);
  }

  public fromEur(
    to: Currencies,
    value: number,
    rate: number | undefined = undefined,
  ): number {

    if (!rate) {
      rate = this.getRate(to);
    }

    return Math.round(value * rate * 100) / 100;
  }

  public toEur(
    from: Currencies,
    value: number,
    rate: number | undefined = undefined,
  ): number {
    if (!rate) {
      rate = this.getRate(from);
    }

    return Math.round((value / rate) * 100) / 100;
  }

  update(
    fields: Partial<Omit<Company, 'access' | 'id' | 'owner'>>,
  ): Observable<Company> {
    return new Observable<Company>((subscriber) => {
      this.http
        .patch(
          `${environment.apiUrl}/api/v1/companies/update?company_id=${this.selectedCompany?.id}`,
          fields,
        )
        .subscribe((response) => {
          const company = response as CompanyResponse;

          this.updateCompaniesLocally(company);

          subscriber.next(company);
          subscriber.complete();
        });
    });
  }

  sseChannel?: WavePrivateChannel;

  sseInit() {
    if (this.sseChannel) {
      this.sseChannel.stopListening(
        '.App\\Events\\Model\\Company\\CompanyUpdate',
      );
    }
    this.sseChannel = this.sse.echo
      .private(`companies.${this.selectedCompany?.id}`)
      .listen(
        '.App\\Events\\Model\\Company\\CompanyUpdate',
        (data: { id: string; company: CompanyResponse }) => {
          this.updateCompaniesLocally(data.company);
        },
      ) as WavePrivateChannel;
  }

  static selectedCompanyKey = 'selected-company-id';
}
