import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousProjectsFilesComponent } from './previous-projects-files.component';

describe('PreviousProjectsFilesComponent', () => {
  let component: PreviousProjectsFilesComponent;
  let fixture: ComponentFixture<PreviousProjectsFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousProjectsFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousProjectsFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
