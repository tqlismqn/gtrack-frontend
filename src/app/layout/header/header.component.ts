import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../modules/auth/services/auth.service';
import { merge } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(
    public companyService: CompanyService,
    public auth: AuthService,
    protected cdr: ChangeDetectorRef,
  ) {
    merge(
      this.companyService.companiesUpdated$,
      this.companyService.companyChanged$,
    ).subscribe(() => {
      this.cdr.markForCheck();
    });
  }
}
