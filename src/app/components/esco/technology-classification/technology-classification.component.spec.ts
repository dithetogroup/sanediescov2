import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyClassificationComponent } from './technology-classification.component';

describe('TechnologyClassificationComponent', () => {
  let component: TechnologyClassificationComponent;
  let fixture: ComponentFixture<TechnologyClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyClassificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
