import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsEditComponent } from './permissions-edit.component';

describe('PermissionsCreateComponent', () => {
  let component: PermissionsEditComponent;
  let fixture: ComponentFixture<PermissionsEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionsEditComponent],
    });
    fixture = TestBed.createComponent(PermissionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
