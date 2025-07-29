import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-key-employees',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatIcon,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatSelectModule,
    MatDividerModule,
    NgIf,
    NgForOf,
    MatOptionModule
  ],
  templateUrl: './key-employees.component.html',
  styleUrl: './key-employees.component.scss'
})
export class KeyEmployeesComponent implements OnInit {

  @Input() parentForm!: FormGroup;
  public maxtDate: Date = new Date();

  // Whether the user has indicated they do not want to fill key employees (toggle)
  public noKeyEmployees = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (!this.noKeyEmployees && this.keyemployeesArray.length === 0) {
      this.addKeyEmployee();
    }
  }

  createEmployeeGroup(): FormGroup {
    return this.fb.group({
      ke_full_names: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      ke_id_no: [''],
      ke_no_yrs_firm: ['', Validators.required],
      ke_highest_education: ['', Validators.required],
      ke_add_traing_certs: [''],
      ke_no_of_yrs_energy: ['', Validators.required],
      ke_emp_cv: [''],
      ke_certification: [''],
      ke_id_type: [''],
      ke_epc_professional_registered: ['No', Validators.required], // Yes/No
      ke_epc_professional_letter: [null], // File upload
      ke_is_new_job: ['No', Validators.required], // Yes/No for newly created job

    });
  }

  get keyemployeesArray() {
    return this.parentForm.get('keyemployees') as FormArray;
  }

  addKeyEmployee() {
    if (this.keyemployeesArray.length < 5) {
      this.keyemployeesArray.push(this.createEmployeeGroup());
    }
  }

  onEPCFileSelected(event: any, i: number) {
    const file = event.target.files[0];
    if (file) {
      this.keyemployeesArray.at(i).patchValue({ ke_epc_professional_letter: file });
    }
  }

  removeKeyEmployee(index: number) {
    if (this.keyemployeesArray.length > 1) {
      this.keyemployeesArray.removeAt(index);
    }
  }

  onFileSelected(event: any, i: number) {
    const file = event.target.files[0];
    if (file) {
      this.keyemployeesArray.at(i).patchValue({ ke_certification: file });
    }
  }

  submitForm() {
    if (this.noKeyEmployees) return;
    if (this.parentForm.valid) {
      // Save to DB or emit event to parent
      console.log('Form submitted:', this.parentForm.value);
    }
  }
}
