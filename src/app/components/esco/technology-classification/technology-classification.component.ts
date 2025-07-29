import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-technology-classification',
  imports: [
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    NgIf,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggle,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './technology-classification.component.html',
  styleUrl: './technology-classification.component.scss'
})
export class TechnologyClassificationComponent {

  @Input() parentForm!: FormGroup;
  public maxtDate: Date = new Date();

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

  tcProjects: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  noTechExperience = false;

  get techClassifications(): FormArray {
    return this.parentForm.get('techClassifications') as FormArray;
  }

  // Whether the user has indicated they do not want to fill key employees (toggle)
  public techclassification = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Ensure FormArray is set up
    if (!this.parentForm.contains('techClassifications')) {
      this.parentForm.addControl('techClassifications', this.fb.array([]));
      this.addTechnologyClassification(); // Start with 1 row
    }
  }


  onNoTechToggle() {
    if (this.noTechExperience) {
      // User says they don't have technology experience, reset FormArray
      this.techClassifications.clear();
      this.parentForm.markAsPristine();
    } else {
      // User wants to enter info, add first row if empty
      if (this.techClassifications.length === 0) {
        this.addTechnologyClassification();
      }
    }
  }

  getAvailableTechnologies(index: number): string[] {
    // Exclude already-selected technologies in other rows
    const selected = this.techClassifications.controls
      .map((ctrl, i) => i !== index ? ctrl.get('tc_tech_entpr_exp')?.value : null)
      .filter(v => !!v);
    return this.technologyClassifications.filter(tc => !selected.includes(tc));
  }

  addTechnologyClassification() {
    if (this.techClassifications.length < this.technologyClassifications.length) {
      this.techClassifications.push(
        this.fb.group({
          tc_tech_entpr_exp: ['', Validators.required],
          tc_no_projs_completed: ['', Validators.required]
        })
      );
    }
  }

  removeTechnologyClassification(index: number) {
    if (this.techClassifications.length > 1) {
      this.techClassifications.removeAt(index);
    }
  }

  canAddMoreTechnology(): boolean {
    // Can't add more than available technologies
    return this.techClassifications.length < this.technologyClassifications.length
      && this.techClassifications.at(this.techClassifications.length - 1).valid;
  }

  onTechSelected(index: number) {
    // Optionally reset the number of projects when tech changes
    this.techClassifications.at(index).get('tc_no_projs_completed')?.reset('');
  }

  submitTechnologyClassifications() {
    if (this.parentForm.valid) {
      // Do what you need with the values!
      console.log('Technology Classifications:', this.techClassifications.value);
    } else {
      this.parentForm.markAllAsTouched();
    }
  }


}
