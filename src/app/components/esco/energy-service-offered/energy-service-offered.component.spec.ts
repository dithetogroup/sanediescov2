import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyServiceOfferedComponent } from './energy-service-offered.component';

describe('EnergyServiceOfferedComponent', () => {
  let component: EnergyServiceOfferedComponent;
  let fixture: ComponentFixture<EnergyServiceOfferedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnergyServiceOfferedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyServiceOfferedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
