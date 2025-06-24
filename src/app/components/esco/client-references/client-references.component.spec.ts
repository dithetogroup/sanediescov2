import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientReferencesComponent } from './client-references.component';

describe('ClientReferencesComponent', () => {
  let component: ClientReferencesComponent;
  let fixture: ComponentFixture<ClientReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientReferencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
