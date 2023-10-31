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
import { ModuleBaseReadRequest } from '../../types/module-base.type';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from '../../../../services/company.service';
import { SortType } from '../../types/soring.type';
import { PaginationType } from '../../types/pagination.type';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { debounceTime, merge, takeUntil, tap } from 'rxjs';
import { MatColumnDef, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Selectable } from '../../../../types/selectable.type';
import { defaultSortableFields } from '../../constants/default-sortable-fields';
import { FormControl } from '@angular/forms';
import { defaultSearchableFields } from '../../constants/default-searchable-fields';
import { BaseModuleService } from '../../services/base-module-service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<B extends { id: string }, F extends { id: string }>
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

  @Input()
  service!: BaseModuleService<B, F>;

  sorting?: SortType;
  pagination: PaginationType = {
    page: 1,
    limit: 5,
  };
  loading = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @Input()
  displayedColumns: string[] = [];

  @Input()
  sortableColumns: Selectable[] = defaultSortableFields;

  @Input()
  searchableColumns: Selectable[] = defaultSearchableFields;

  sortingFieldControl = new FormControl<string | undefined>('', {
    nonNullable: true,
  });

  searchingFieldControl = new FormControl<string | undefined>('', {
    nonNullable: true,
  });

  searchingValueControl = new FormControl<string | undefined>('', {
    nonNullable: true,
  });

  get moduleName() {
    return this.service.moduleName;
  }
  get moduleItemName() {
    return this.service.moduleItemName;
  }

  ngOnInit() {
    this.fetch();

    this.sortingFieldControl.valueChanges
      .pipe(
        tap((value) => {
          this.sortChange(value);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    merge(
      this.searchingFieldControl.valueChanges,
      this.searchingValueControl.valueChanges,
    )
      .pipe(
        debounceTime(300),
        tap(() => {
          this.fetch();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.sortingFieldControl.valueChanges.subscribe((value) => {
      this.sortChange(value);
    });

    this.service.data$
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.cdr.markForCheck();
        }),
      )
      .subscribe();
  }

  @ViewChild(MatTable, { static: true }) table!: MatTable<F>;
  @ViewChild(MatTable, { read: ElementRef }) tableRef!: ElementRef;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef> =
    new QueryList<MatColumnDef>();

  ngAfterContentInit() {
    this.columnDefs.forEach((columnDef) => this.table.addColumnDef(columnDef));
  }

  sortChange(field?: string) {
    if (field) {
      this.sorting = {
        field,
        dir: 'desc',
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
    if (this.searchingValueControl.value && this.searchingFieldControl.value) {
      body.search = {
        field: this.searchingFieldControl.value,
        value: this.searchingValueControl.value,
      };
    }

    this.loading = true;

    this.service.read(body).subscribe({
      next: ([data, count]) => {
        this.paginator.length = count;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  delete(item: F) {
    this.service.delete(item.id).subscribe(() => {
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

  toCsv() {
    const table = this.tableRef.nativeElement as HTMLTableElement;
    const header: { index: number; text: string }[] = [];
    const body: string[][] = [];

    for (const [index, th] of Array.from(
      table.querySelectorAll('th'),
    ).entries()) {
      if (!th) {
        continue;
      }
      const text = th.textContent?.trim();
      if (!text) {
        continue;
      }
      header.push({ index, text });
    }

    for (const [, tr] of Array.from(
      table.querySelectorAll('tbody tr'),
    ).entries()) {
      const row: string[] = [];

      for (const { index: colIndex } of header) {
        const cell = tr.querySelector(
          `td:nth-child(${colIndex + 1})`,
        ) as HTMLDivElement;
        const text = cell.textContent?.trim();
        row.push(text ?? '');
      }

      body.push(row);
    }

    this.downloadCsv(
      this.arrayToCsv([header.map((item) => item.text), ...body]),
    );
  }

  protected arrayToCsv(data: string[][]) {
    return data
      .map((row) =>
        row
          .map(String)
          .map((v) => v.replaceAll('"', '""'))
          .map((v) => `"${v}"`)
          .join(','),
      )
      .join('\r\n');
  }

  protected downloadCsv(content: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.moduleName}-export`;
    a.click();
    a.remove();
  }
}
