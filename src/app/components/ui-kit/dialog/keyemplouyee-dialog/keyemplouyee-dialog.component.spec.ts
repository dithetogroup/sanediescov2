import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyemplouyeeDialogComponent } from './keyemplouyee-dialog.component';

describe('KeyemplouyeeDialogComponent', () => {
  let component: KeyemplouyeeDialogComponent;
  let fixture: ComponentFixture<KeyemplouyeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyemplouyeeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyemplouyeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
