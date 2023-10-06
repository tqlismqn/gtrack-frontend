import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Company, CompanyResponse } from '../types/company.type';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  companies: Company[] = [];

  constructor(protected http: HttpClient) {}

  fetchCompanies(): Observable<Company[]> {
    return new Observable<Company[]>((subscriber) => {
      this.http.get(`${environment.apiUrl}/api/v1/company`).subscribe({
        next: (response) => {
          this.companies = response as CompanyResponse[];
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
}
