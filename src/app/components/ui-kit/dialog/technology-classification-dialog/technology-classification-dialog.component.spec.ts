import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyClassificationDialogComponent } from './technology-classification-dialog.component';

describe('TechnologyClassificationDialogComponent', () => {
  let component: TechnologyClassificationDialogComponent;
  let fixture: ComponentFixture<TechnologyClassificationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyClassificationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyClassificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
