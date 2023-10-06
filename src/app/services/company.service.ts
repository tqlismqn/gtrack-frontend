import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Company, CompanyResponse } from '../types/company.type';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  companies: Company[] = [];
  selectedCompany?: Company;

  companyChanged$ = new EventEmitter<Company>();

  constructor(protected http: HttpClient) {}

  fetchCompanies(): Observable<Company[]> {
    return new Observable<Company[]>((subscriber) => {
      this.http.get(`${environment.apiUrl}/api/v1/company`).subscribe({
        next: (response) => {
          this.companies = response as CompanyResponse[];
          this.selectDefaultCompany();
          subscriber.next(this.companies);
          subscriber.complete();
        },
        error: (err) => {
          console.error(err);
          subscriber.error(err);
          subscriber.complete();
        },
      });
    });
  }

  selectCompanyById(id: number): boolean {
    const company = this.companies.find((item) => item.id === id);
    if (company) {
      this.selectedCompany = company;
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
    this.companyChanged$.emit(this.selectedCompany);
    localStorage.setItem(
      CompanyService.selectedCompanyKey,
      this.selectedCompany.id.toString(),
    );
    return true;
  }

  selectDefaultCompany() {
    const storedId = Number(
      localStorage.getItem(CompanyService.selectedCompanyKey),
    );

    if (Number.isInteger(storedId)) {
      if (!this.selectCompanyById(Number(storedId))) {
        this.selectFirstCompany();
      }
    } else {
      this.selectFirstCompany();
    }
  }

  static selectedCompanyKey = 'selected-company-id';
}
