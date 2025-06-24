import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PreviousProjectsComponent } from '../previous-projects/previous-projects.component';
import { KeyEmployeesComponent } from '../key-employees/key-employees.component';
import { ClientReferencesComponent } from '../client-references/client-references.component';
import { CompanyInformationComponent } from '../company-information/company-information.component';
import { SectorExperienceComponent } from '../sector-experience/sector-experience.component';
import { TechnologyClassificationComponent } from '../technology-classification/technology-classification.component';
import { EnergyServiceOfferedComponent } from '../energy-service-offered/energy-service-offered.component';
import { CompanyEquityComponent } from "../company-equity/company-equity.component";
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-stepper-form',
  imports: [
    MatStepperModule,
    ReactiveFormsModule,
    MatProgressBar,
    MatCardContent,
    MatCard,
    MatCardHeader,
    MatButtonModule,
    PreviousProjectsComponent,
    NgStyle,
    // KeyEmployeesComponent,
    //ClientReferencesComponent,
    CompanyInformationComponent,
    //SectorExperienceComponent,
    //TechnologyClassificationComponent,
    EnergyServiceOfferedComponent,
   // CompanyEquityComponent
],
  //bootstrap: [AppComponent],
  templateUrl: './stepper-form.component.html',
  styleUrl: './stepper-form.component.scss'
})
export class StepperFormComponent {
  @ViewChild('stepper') stepper!: MatStepper;
  progress: number = 0;
  totalSteps: number = 3;

  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.step1Form = this.fb.group({
      projects: this.fb.array([this.createProjectGroup()])
    });
    this.step2Form = this.fb.group({
      // Example field
      energy_service: ['', Validators.required]
    });
    this.step3Form = this.fb.group({
      // Example field
      company_name: ['', Validators.required]
    });
  }

  createProjectGroup() {
    return this.fb.group({
      he_client_name: ['', Validators.required],
      he_contact_person: ['', Validators.required],
      he_client_contact_no: ['', Validators.required],
      he_proj_desc: ['', Validators.required],
      he_contact_email: ['', [Validators.required, Validators.email]],
      he_proj_value: ['', Validators.required],
      he_proj_start_date: ['', Validators.required],
      he_proj_end_date: ['', Validators.required],
      he_reference_letter: [null]
    });
  }

  get projectsArray() {
    return this.step1Form.get('projects') as FormArray;
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

  ngAfterViewInit() {
    this.updateProgress();
    this.stepper.selectionChange.subscribe(() => {
      this.updateProgress();
    });
  }

  updateProgress() {
    this.progress = Math.round((this.stepper.selectedIndex / this.totalSteps) * 100);
  }

  completeStepper() {
    alert('🎉 Form completed!');
    this.progress = 100;
  }

  getProgressBarColor(progress: number): string {
    let r, g, b;
    if (progress < 50) {
      r = 255;
      g = Math.round(255 * (progress / 50));
      b = 0;
    } else {
      r = Math.round(255 * (1 - (progress - 50) / 50));
      g = 255 - Math.round(55 * ((progress - 50) / 50));
      b = 0;
    }
    return `rgb(${r},${g},${b})`;
  }
}
