import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Validators } from 'ngx-editor';

@Component({
  selector: 'app-previous-projects',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatDatepicker,
    MatDatepickerToggle,
    MatIcon,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
],
  templateUrl: './previous-projects.component.html',
  styleUrl: './previous-projects.component.scss'
})
export class PreviousProjectsComponent {

  projectForm: FormGroup;
  maxtDate: Date = new Date();
  maxEndDate: Date = new Date();

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      he_client_name: ['', Validators.required],
      he_contact_person: ['', Validators.required],
      he_client_contact_no: ['', Validators.required],
      he_proj_desc: ['', Validators.required],
      he_contact_email: ['', Validators.required],
      he_proj_value: ['', Validators.required],
      he_proj_start_date: ['', Validators.required],
      he_proj_end_date: ['', Validators.required],
      he_reference_letter: [null]
    });
    this.maxEndDate = new Date();
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.projectForm.patchValue({ he_reference_letter: file });
    }
  }
  

  submitForm() {
    console.log(this.projectForm.value);
    // Submit using FormData object if uploading files
  }

}
