import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorExpDialogComponent } from './sector-exp-dialog.component';

describe('SectorExpDialogComponent', () => {
  let component: SectorExpDialogComponent;
  let fixture: ComponentFixture<SectorExpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectorExpDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectorExpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
