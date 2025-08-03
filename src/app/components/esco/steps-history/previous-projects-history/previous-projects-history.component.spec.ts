import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousProjectsHistoryComponent } from './previous-projects-history.component';

describe('PreviousProjectsHistoryComponent', () => {
  let component: PreviousProjectsHistoryComponent;
  let fixture: ComponentFixture<PreviousProjectsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousProjectsHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousProjectsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
