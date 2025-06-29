import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyserviceDialogComponent } from './energyservice-dialog.component';

describe('EnergyserviceDialogComponent', () => {
  let component: EnergyserviceDialogComponent;
  let fixture: ComponentFixture<EnergyserviceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnergyserviceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyserviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
