import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, AbstractControl, FormArray, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerToggle, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-client-references',
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
    MatOptionModule,
    MatSelectModule,
    NgIf,
    NgForOf,
],
  templateUrl: './client-references.component.html',
  styleUrl: './client-references.component.scss'
})
export class ClientReferencesComponent implements OnInit{


  @Input() parentForm!: FormGroup;
  public noClientReferences = false;
  public maxDate: Date = new Date();
  public maxEndDate: Date = new Date();

  technologyClassifications: string[] = [
    'LED for public lighting(Street-lighting & High mast lighting)',
    'Building Lighting',
    'High efficient HVAC',
    'High efficient water heating systems',
    'High efficient steam boilers / systems',
    'High efficient motors and pumps for fresh and wastewater',
    'Water and Wastewater Treatment',
    'Cogeneration',
    'Cogeneration (with biogas)',
    'Biogas',
    'Energy management systems and Smart Metering',
    'Small-Scale Solar PV systems'
  ];    

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Only add a client reference if user says they DO have references
    if (!this.noClientReferences && this.clientReferencesArray.length === 0) {
      this.addClientReference();
    }
  }

  createClientReferenceGroup(): FormGroup {
    return this.fb.group({
      cr_client_name: ['', Validators.required],
      cr_contact_person: ['', Validators.required],
      cr_client_contact_no: ['', Validators.required],
      cr_proj_desc: ['', Validators.required],
      cr_contact_email: ['', [Validators.required, Validators.email]],
      cr_proj_value: [''],
      cr_technologies: [[], Validators.required],
      cr_start_date: ['', Validators.required],
      cr_end_date: ['', Validators.required],
      cr_reference_letter: [null]
    }, { validators: [this.endDateAfterStartDateValidator()] });
  }



  onNoClientReferencesChange() {
    if (this.noClientReferences) {
      this.parentForm.reset();
      this.parentForm.disable();
    } else {
      this.parentForm.enable();

      const clientReferences = this.clientReferencesArray;
      if (clientReferences.length === 0) {
        this.addClientReference(); // Ensure one form is shown when toggle is OFF
      }
    }
  }


  // getAvailableTechnologies(index: number): string[] {
  //   // Exclude already-selected technologies in other rows
  //   const selected = this.noClientReferences.controls
  //     .map((ctrl, i) => i !== index ? ctrl.get('cr_technologies')?.value : null)
  //     .filter(v => !!v);
  //   return this.technologyClassifications.filter(tc => !selected.includes(tc));
  // }

  addClientReference() {
    if (this.clientReferencesArray.length < 5) {
      this.clientReferencesArray.push(this.createClientReferenceGroup());
    }
  }

  // onTechSelected(index: number) {
  //   // Optionally reset the number of projects when tech changes
  //   this.techClassifications.at(index).get('cr_technologies')?.reset('');
  // }



  // Custom validator: end date must be >= start date
  endDateAfterStartDateValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('cr_start_date')?.value;
      const end = group.get('cr_end_date')?.value;
      if (start && end && new Date(end) < new Date(start)) {
        return { endBeforeStart: true };
      }
      return null;
    };
  }

  get clientReferencesArray() {
    return this.parentForm.get('clientReferences') as FormArray;
  }

 
  removeClientReference(index: number) {
    if (this.clientReferencesArray.length > 1) {
      this.clientReferencesArray.removeAt(index);
    }
  }

  onFileSelected(event: any, i: number) {
    const file = event.target.files[0];
    if (file) {
      this.clientReferencesArray.at(i).patchValue({ cr_reference_letter: file });
    }
  }

  submitForm() {
    if (this.noClientReferences) return;
    if (this.parentForm.valid) {
      // Save to DB
      console.log('Form submitted:', this.parentForm.value);
    }
  }
}

