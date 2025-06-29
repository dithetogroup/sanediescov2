import { Component, OnInit, ViewChild, NgZone, AfterViewInit , ChangeDetectorRef} from '@angular/core';
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
import { NgIf, NgStyle } from '@angular/common';
import { PreviousprojectDialogComponent } from '../../ui-kit/dialog/previousproject-dialog/previousproject-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { EnergyserviceDialogComponent } from '../../ui-kit/dialog/energyservice-dialog/energyservice-dialog.component';

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
    MatIconModule,
    NgIf,
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
export class StepperFormComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  progress: number = 0;
  totalSteps: number = 3;

  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog, 
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
) {

    this.step1Form = this.fb.group({
      projects: this.fb.array([]) 
    });

    this.step2Form = this.fb.group({});

    this.step3Form = this.fb.group({
      company_name: ['', Validators.required]
    });
    
  }

  ngOnInit() {
    // Optionally initialize one empty project if needed
    const projectsArray = this.step1Form.get('projects') as FormArray;
    if (projectsArray.length === 0) {
      // Let PreviousProjectsComponent initialize via its addProject() method if needed
    }
  }

  ngAfterViewInit() {
    //This ensures progress updates even when clicking "Next"
    this.ngZone.onStable.subscribe(() => {
      setTimeout(() => this.updateProgress(), 0);
    });


    this.stepper.selectionChange.subscribe((event) => {
      console.log('Stepper moved to step:', event.selectedIndex);
      this.updateProgress();
    });
    setTimeout(() => this.cdr.detectChanges());

  }
  
  updateProgress() {
    const selectedIndex = this.stepper?.selectedIndex ?? 0;
    const stepCount = this.stepper?.steps?.length ?? this.totalSteps;
    if (stepCount <= 1) {
      this.progress = 0;
      return;
    }
    // Show 100% only after last step is confirmed/complete
    this.progress = Math.round((selectedIndex / stepCount) * 100);
  }
  completeStepper() {
    alert('🎉 Form completed!');
    this.progress = 100;
  }
  

  // updateProgress() {
  //   const selectedIndex = this.stepper?.selectedIndex ?? 0;
  //   const stepCount = this.stepper?.steps?.length ?? this.totalSteps;
  //   // Avoid division by zero
  //   if (stepCount <= 1) {
  //     this.progress = 0;
  //     return;
  //   }
  //   // Calculate percentage (0% at step 0, 100% at last step)
  //   this.progress = Math.round((selectedIndex / (stepCount - 1)) * 100);
  // }


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

  get currentStep(): number {
    return (this.stepper?.selectedIndex ?? 0) + 1;
  }
  
  get stepCount(): number {
    return this.stepper?.steps?.length ?? 0;
  }
  

  /* Dialog triggers */
  openDialogPreviousProjects() {
    this.dialog.open(PreviousprojectDialogComponent);
  }

  openDialogEnergyService() {
    this.dialog.open(EnergyserviceDialogComponent);
  }
}