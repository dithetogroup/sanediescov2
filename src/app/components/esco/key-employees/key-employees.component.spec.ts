import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyEmployeesComponent } from './key-employees.component';

describe('KeyEmployeesComponent', () => {
  let component: KeyEmployeesComponent;
  let fixture: ComponentFixture<KeyEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyEmployeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
