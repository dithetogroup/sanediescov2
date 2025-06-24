import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorExperienceComponent } from './sector-experience.component';

describe('SectorExperienceComponent', () => {
  let component: SectorExperienceComponent;
  let fixture: ComponentFixture<SectorExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectorExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectorExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
