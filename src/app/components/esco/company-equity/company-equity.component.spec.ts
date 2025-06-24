import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEquityComponent } from './company-equity.component';

describe('CompanyEquityComponent', () => {
  let component: CompanyEquityComponent;
  let fixture: ComponentFixture<CompanyEquityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyEquityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyEquityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
