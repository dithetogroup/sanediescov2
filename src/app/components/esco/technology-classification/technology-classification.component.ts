import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateService } from '../../common/services/create/create.service';
import { ReadService } from '../../common/services/read/read.service';
import { UpdateService } from '../../common/services/update/update.service';
import { DeleteService } from '../../common/services/delete/delete.service';

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
export class TechnologyClassificationComponent implements OnInit {

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

  tcProjects: number[] = [1,2,3,4,5,6,7,8,9,10];
  noTechExperience = false;
  isDirty = false;
  lastSavedAt: Date | null = null;
  esco_id = "ESCo-A001"; // You may want to get this from parent or a service

  constructor(
    private fb: FormBuilder,
    private createService: CreateService,
    private updateService: UpdateService,
    private readService: ReadService,
    private deleteService: DeleteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.loadTechnologyClassifications();

    if (!this.parentForm.contains('techClassifications')) {
      this.parentForm.addControl('techClassifications', this.fb.array([]));
      this.addTechnologyClassification(); // Start with 1 row
    }
    this.parentForm.valueChanges.subscribe(() => {
      this.isDirty = this.parentForm.dirty;
    });
    
  }

  get techClassifications(): FormArray {
    return this.parentForm.get('techClassifications') as FormArray;
  }

  // Load existing rows for edit mode
  loadTechnologyClassifications() {
    debugger;

    this.readService.StepGetTechnologyClassifications(this.esco_id).subscribe(res => {
      if (res.status === 'success' && res.data && Array.isArray(res.data)) {
        const arr = this.parentForm.get('techClassifications') as FormArray;
        arr.clear();
        res.data.forEach((tc: any) => {
          console.log('[API DATA]', res.data);

          arr.push(this.fb.group({
            tc_id: [tc.tc_id],
            tc_tech_entpr_exp: [tc.tc_tech_entpr_exp, Validators.required],
            tc_no_projs_completed: [tc.tc_no_projs_completed, Validators.required]
          }));
        });
        this.isDirty = false;
        this.lastSavedAt = new Date();
      }
    });
  }
  

  markAsSaved() {
    this.isDirty = false;
    this.lastSavedAt = new Date();
  }

  onNoTechToggle() {
    if (this.noTechExperience) {
      // User says they don't have technology experience, clear and remove validation
      this.techClassifications.clear();
      this.parentForm.get('techClassifications')?.clearValidators();
      this.parentForm.get('techClassifications')?.updateValueAndValidity();
      this.parentForm.markAsPristine();
    } else {
      this.parentForm.get('techClassifications')?.setValidators(Validators.required);
      if (this.techClassifications.length === 0) {
        this.addTechnologyClassification();
      }
    }
  }

  getAvailableTechnologies(index: number): string[] {
    const selected = this.techClassifications.controls
      .map((ctrl, i) => i !== index ? ctrl.get('tc_tech_entpr_exp')?.value : null)
      .filter(v => !!v);
    return this.technologyClassifications.filter(tc => !selected.includes(tc));
  }

  addTechnologyClassification() {
    if (this.techClassifications.length < this.technologyClassifications.length) {
      this.techClassifications.push(
        this.fb.group({
          tc_id: [null], // for editing
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
    return this.techClassifications.length < this.technologyClassifications.length
      && this.techClassifications.at(this.techClassifications.length - 1).valid;
  }

  onTechSelected(index: number) {
    this.techClassifications.at(index).get('tc_no_projs_completed')?.reset('');
  }

  // Main Save (Bulk Add/Edit/Delete), returns a promise for the parent stepper
  submitTechnologyClassifications(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.parentForm.valid && this.techClassifications.length > 0) {
        const payload = this.techClassifications.value.map((item: any) => ({
          tc_id: item.tc_id, // if editing
          esco_id: this.esco_id,
          tc_tech_entpr_exp: item.tc_tech_entpr_exp,
          tc_no_projs_completed: item.tc_no_projs_completed,
        }));

      //  debugger;
        this.createService.StepSaveTechnologyClassifications(payload).subscribe({
          next: (res) => {
            debugger;
            if (res.status === 'success') {
              this.snackBar.open('Technology Classifications saved!', 'Close', {
                duration: 3500,
                panelClass: ['snackbar-success']
              });
              this.markAsSaved();
              resolve(true);
            } else {
              this.snackBar.open('Failed to save. Try again.', 'Close', {
                duration: 4000, panelClass: ['snackbar-error']
              });
              resolve(false);
            }
          },
          error: () => {
            this.snackBar.open('Error saving Technology Classifications.', 'Close', {
              duration: 4000, panelClass: ['snackbar-error']
            });
            resolve(false);
          }
        });
      } else {
        this.parentForm.markAllAsTouched();
        resolve(false);
      }
    });
  }

  // Soft delete a row (for single row delete with backend call)
  deleteTechnologyClassification(tc_id: number) {
    this.deleteService.StepDeleteTechnologyClassification(tc_id).subscribe(res => {
      if (res.status === 'success') {
        this.snackBar.open('Technology deleted.', 'Close', {
          duration: 3500,
          panelClass: ['snackbar-success']
        });
        this.loadTechnologyClassifications();
      } else {
        this.snackBar.open('Delete failed.', 'Close', {
          duration: 4000, panelClass: ['snackbar-error']
        });
      }
    });
  }
}
