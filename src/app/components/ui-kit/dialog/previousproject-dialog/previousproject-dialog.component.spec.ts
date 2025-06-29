import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousprojectDialogComponent } from './previousproject-dialog.component';

describe('PreviousprojectDialogComponent', () => {
  let component: PreviousprojectDialogComponent;
  let fixture: ComponentFixture<PreviousprojectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousprojectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousprojectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
