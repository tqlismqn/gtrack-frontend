import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { LoadingState } from '../../../auth/components/auth-form/auth-form.component';
import { History } from '../../types/history.type';
import { CompanyService } from '../../../../services/company.service';
import { ModulesService } from '../../../../services/modules.service';
import {AdminModules, Modules, SuperAdminModules} from '../../../../constants/modules';
import { ModuleBase } from '../../types/module-base.type';
import { AddTabDirective } from '../../../customers/directives/add-tab.directive';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFormComponent implements OnInit {
  @Output()
  submit$ = new EventEmitter<void>();

  @Input()
  formTitle?: string;

  @Input()
  submitTitle = 'Save';

  @Input()
  disableGrid = false;

  errors?: { [key: string]: string };

  loading = false;
  loadingState: LoadingState = 'loading';

  @Input()
  history?: History[] = undefined;
  displayedColumns = ['user', 'field', 'from', 'to', 'date'];

  users: Record<string, string> = {};

  @Input()
  module?: Modules | AdminModules | SuperAdminModules;

  @ContentChildren(AddTabDirective) additionalTabs?: QueryList<AddTabDirective>;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected companyService: CompanyService,
    protected modulesService: ModulesService,
  ) {}

  ngOnInit() {
    this.companyService.getUserSelections().subscribe((items) => {
      for (const user of items) {
        this.users[user.id] = user.name;
      }
      this.cdr.markForCheck();
    });
  }

  getFieldName(field: keyof ModuleBase) {
    if (this.module) {
      const moduleFieldNames =
        this.modulesService.modulesFieldNames[`${this.module}`];
      if (moduleFieldNames) {
        // @ts-ignore
        const fieldName = moduleFieldNames[field];
        if (fieldName) {
          return fieldName;
        }
      }
    }

    return field;
  }

  startLoading() {
    this.loading = true;
    this.loadingState = 'loading';
  }

  endLoading(state: LoadingState) {
    this.loadingState = state;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.loading = false;
      this.cdr.markForCheck();
    }, 500);
  }

  processError(error: any) {
    this.endLoading('error');
    throw error;
  }

  protected readonly undefined = undefined;
}
