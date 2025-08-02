import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientReferenceDialogComponent } from './client-reference-dialog.component';

describe('ClientReferenceDialogComponent', () => {
  let component: ClientReferenceDialogComponent;
  let fixture: ComponentFixture<ClientReferenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientReferenceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientReferenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
