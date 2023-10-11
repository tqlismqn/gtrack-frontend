import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersCreateComponent } from './customers-create.component';

describe('CustomersCreateComponent', () => {
  let component: CustomersCreateComponent;
  let fixture: ComponentFixture<CustomersCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomersCreateComponent]
    });
    fixture = TestBed.createComponent(CustomersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
