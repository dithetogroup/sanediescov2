import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../../app-routing.module';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCard } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PreviousProjectsComponent } from '../previous-projects/previous-projects.component';
import { KeyEmployeesComponent } from '../key-employees/key-employees.component';
import { ClientReferencesComponent } from '../client-references/client-references.component';
import { CompanyInformationComponent } from '../company-information/company-information.component';
import { SectorExperienceComponent } from '../sector-experience/sector-experience.component';
import { TechnologyClassificationComponent } from '../technology-classification/technology-classification.component';
import { EnergyServiceOfferedComponent } from '../energy-service-offered/energy-service-offered.component';
import { CompanyEquityComponent } from "../company-equity/company-equity.component";

@Component({
  selector: 'app-stepper-form',
  imports: [
    // BrowserModule,
    // AppRoutingModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatProgressBar,
    MatCard,
    MatButtonModule,
    PreviousProjectsComponent,
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

  // Set this to the number of steps in your stepper!
  totalSteps: number = 3;

  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
 // step4Form: FormGroup;
// step5Form: FormGroup;
 // step6Form: FormGroup;
 // step7Form: FormGroup;
 // step8Form: FormGroup;
 // stepForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.step1Form = this.fb.group({});
    this.step2Form = this.fb.group({});
    this.step3Form = this.fb.group({});
  }

  ngAfterViewInit() {
    this.updateProgress();
    this.stepper.selectionChange.subscribe(() => {
      this.updateProgress();
    });
  }

  updateProgress() {
   // this.progress = Math.round(((this.stepper.selectedIndex + 1) / this.totalSteps) * 100);
    this.progress = Math.round((this.stepper.selectedIndex / this.totalSteps) * 100);

  }

  completeStepper() {
    alert('🎉 Form completed!');
    this.progress = 100;
  }

}
// function ViewChild(arg0: string): (target: StepperFormComponent, propertyKey: "stepper") => void {
//   throw new Error('Function not implemented.');
// }

