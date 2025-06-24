import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-energy-service-offered',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,    
    MatIconModule,
   // NgFor
],
  templateUrl: './energy-service-offered.component.html',
  styleUrl: './energy-service-offered.component.scss'
})
export class EnergyServiceOfferedComponent {

  serviceOfferedForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.serviceOfferedForm = this.fb.group({
      so_isOther: [''],
      so_industry: ['', Validators.required],
    });
  }



  submitServiceOffered() {
    if (this.serviceOfferedForm.valid) {
      console.log('Submitted:', this.serviceOfferedForm.value);
    } else {
      console.warn('Form invalid');
      this.serviceOfferedForm.markAllAsTouched();
    }
  }

}
