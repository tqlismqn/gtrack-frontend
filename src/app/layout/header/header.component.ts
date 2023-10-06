import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../modules/auth/services/auth.service';

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
  ) {}
}
