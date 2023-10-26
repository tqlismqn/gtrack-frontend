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

@Injectable({ providedIn: 'root' })
export class CompanyService {
  companies: Company[] = [];
  ownCompanies: Company[] = [];
  permissions: Permission[] = [];
  selectedCompany?: Company;
  selectedPermissions?: Permission[];

  companyChanged$ = new EventEmitter<Company>();

  constructor(
    protected http: HttpClient,
    protected sse: SseService,
  ) {}

  protected fetchCompanies(): Observable<Company[]> {
    return new Observable<Company[]>((subscriber) => {
      this.http.get(`${environment.apiUrl}/api/v1/companies`).subscribe({
        next: (response) => {
          this.companies = response as CompanyResponse[];
          this.ownCompanies = this.companies.filter((item) => item.owner);
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
      return true;
    }

    return false;
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

  static selectedCompanyKey = 'selected-company-id';
}
