import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySurveyComponent } from './company-survey.component';

describe('CompanySurveyComponent', () => {
  let component: CompanySurveyComponent;
  let fixture: ComponentFixture<CompanySurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanySurveyComponent],
    });
    fixture = TestBed.createComponent(CompanySurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
