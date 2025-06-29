import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormArray, Validators, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-previous-projects',
  imports: [
    CommonModule,
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
    FormsModule,
    MatSlideToggle,
    MatDividerModule,
    NgIf,
    NgForOf,
],
  templateUrl: './previous-projects.component.html',
  styleUrl: './previous-projects.component.scss'
})

export class PreviousProjectsComponent implements OnInit {

  @Input() parentForm!: FormGroup; 
  public noProjects = false;
  public maxtDate: Date = new Date();
  public maxEndDate: Date = new Date();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Only add a project if user says they DO have projects
    if (!this.noProjects && this.projectsArray.length === 0) {
      this.addProject();
    }
  }
  
  onNoProjectsChange() {
    if (this.noProjects) {
      this.parentForm.reset();
      this.parentForm.disable();
    } else {
      this.parentForm.enable();
  
      const projects = this.projectsArray;
      if (projects.length === 0) {
        this.addProject(); // Ensure one form is shown when toggle is OFF
      }
    }
  }
  

  createProjectGroup(): FormGroup {
    return this.fb.group({
      he_client_name: ['', Validators.required],
      he_contact_person: ['', Validators.required],
      he_client_contact_no: ['', Validators.required],
      he_proj_desc: ['', Validators.required],
      he_contact_email: ['', [Validators.required, Validators.email]],
      he_proj_value: [''],
      he_proj_start_date: ['', Validators.required],
      he_proj_end_date: ['', Validators.required],
      he_reference_letter: [null]
    }, { validators: [this.endDateAfterStartDateValidator()] });
  }

  // Custom validator: end date must be >= start date
endDateAfterStartDateValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get('he_proj_start_date')?.value;
    const end = group.get('he_proj_end_date')?.value;
    if (start && end && new Date(end) < new Date(start)) {
      return { endBeforeStart: true };
    }
    return null;
  };
}


  get projectsArray() {
    return this.parentForm.get('projects') as FormArray;
  }
  
  addProject() {
    if (this.projectsArray.length < 5) {
      this.projectsArray.push(this.createProjectGroup());
    }
  }
  
  removeProject(index: number) {
    if (this.projectsArray.length > 1) {
      this.projectsArray.removeAt(index);
    }
  }
  
  onFileSelected(event: any, i: number) {
    const file = event.target.files[0];
    if (file) {
      this.projectsArray.at(i).patchValue({ he_reference_letter: file });
    }
  }
  

  submitForm() {
    if (this.noProjects) return;
    if (this.parentForm.valid) {
      // Save to DB
      console.log('Form submitted:', this.parentForm.value);
    }
  }
}
