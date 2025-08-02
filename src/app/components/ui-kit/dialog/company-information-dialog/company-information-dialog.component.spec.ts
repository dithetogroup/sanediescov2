import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInformationDialogComponent } from './company-information-dialog.component';

describe('CompanyInformationDialogComponent', () => {
  let component: CompanyInformationDialogComponent;
  let fixture: ComponentFixture<CompanyInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyInformationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
