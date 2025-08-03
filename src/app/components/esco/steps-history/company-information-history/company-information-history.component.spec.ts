import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInformationHistoryComponent } from './company-information-history.component';

describe('CompanyInformationHistoryComponent', () => {
  let component: CompanyInformationHistoryComponent;
  let fixture: ComponentFixture<CompanyInformationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyInformationHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyInformationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
