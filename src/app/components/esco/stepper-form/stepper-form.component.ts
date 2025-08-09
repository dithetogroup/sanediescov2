import { Component, OnInit, ViewChild, NgZone, AfterViewInit , ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormArray, AbstractControl } from '@angular/forms';
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
import { KeyemplouyeeDialogComponent } from '../../ui-kit/dialog/keyemplouyee-dialog/keyemplouyee-dialog.component';
import { TechnologyClassificationDialogComponent } from '../../ui-kit/dialog/technology-classification-dialog/technology-classification-dialog.component';
import { ClientReferenceDialogComponent } from '../../ui-kit/dialog/client-reference-dialog/client-reference-dialog.component';
import { CompanyInformationDialogComponent } from '../../ui-kit/dialog/company-information-dialog/company-information-dialog.component';
import { SectorExpDialogComponent } from '../../ui-kit/dialog/sector-exp-dialog/sector-exp-dialog.component';

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
    ClientReferencesComponent,
    CompanyInformationComponent,
    EnergyServiceOfferedComponent,
    KeyEmployeesComponent,
    TechnologyClassificationComponent,
    SectorExperienceComponent,
    CompanyEquityComponent
],
  //bootstrap: [AppComponent],
  templateUrl: './stepper-form.component.html',
  styleUrl: './stepper-form.component.scss'
})
export class StepperFormComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('companyInfoRef') companyInfoComponent!: CompanyInformationComponent;
  @ViewChild('previousProjectsRef') previousProjectsComponent!: PreviousProjectsComponent;
  @ViewChild('clientReferencesRef') clientReferencesComponent!: ClientReferencesComponent;
  @ViewChild('companyEquityRef') companyEquityComponent!: CompanyEquityComponent;
  @ViewChild('technologyClassificationRef') technologyClassificationComponent!: TechnologyClassificationComponent;
  @ViewChild('sectorExperienceRef') sectorExperienceComponent!: SectorExperienceComponent;




  progress: number = 0;
  totalSteps: number = 3;


  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  step4Form: FormGroup;
  step5Form: FormGroup;
  step6Form: FormGroup;
  step7Form: FormGroup;
  step8Form: FormGroup;

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
      ci_energy_man_exp: ['', Validators.required],
      ci_com_exp_of_tech_pro: ['', Validators.required],
      ci_business_activities_provinces: [[], Validators.required],
      ci_cicp_file: [null]
    });

    this.step4Form = this.fb.group({
      keyemployees: this.fb.array([]) 
    });

    this.step5Form = this.fb.group({
      techClassifications: this.fb.array([]) 
    });    

    this.step7Form = this.fb.group({
      clientReferences: this.fb.array([]) 
    });

    this.step6Form = this.fb.group({});

    this.step8Form = this.fb.group({
      ce_woman_owned: ['', Validators.required],
      ce_black_owned: ['', Validators.required],
      ce_youth_owned: ['', Validators.required],
      ce_bee_equity_cert: ['']
    });
    
  }

  private isFormArray(ctrl: AbstractControl | null): ctrl is FormArray {
    return ctrl instanceof FormArray;
  }

  checkEmptyFormArray(form: FormGroup, arrayName: string): boolean {
    const ctrl = form.get(arrayName);
    if (!this.isFormArray(ctrl)) return true;
    return ctrl.length === 0;
  }


  ngOnInit() {
    // Add each step/array combo you want to check here
    const checks = [
      {form: this.step1Form, arrayName: 'projects'},
      {form: this.step4Form, arrayName: 'keyemployees'},
      {form: this.step7Form, arrayName: 'clientReferences'},
      {form: this.step5Form, arrayName: 'techClassifications'},
      // Add more steps as you need (e.g., step2Form/arrayName)
    ];

    checks.forEach(cfg => {
      if (this.checkEmptyFormArray(cfg.form, cfg.arrayName)) {
        // You can handle the empty array case here
        // For example:
        // this.doSomethingForEmptyArray(cfg.form, cfg.arrayName);
      }
    });
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

  //save company information
  handleNextForCompanyProfile() {
    if (this.companyInfoComponent.isDirty) {
      this.companyInfoComponent.submitCompanyInformation().then(success => {
        if (success) {
          this.companyInfoComponent.markAsSaved();
          this.stepper.next();
        }
      });
    } else {
      this.stepper.next();
    }
  }


  //Save previous projects
  handleNextForPreviousProjects() {
    if (this.previousProjectsComponent.isDirty) {
      this.previousProjectsComponent.submitPreviousProjects().then(success => {
        if (success) {
          this.previousProjectsComponent.markAsSaved();
          this.stepper.next();
        }
      });
    } else {
      this.stepper.next();
    }
  }  

  //Client References
  handleNextForClientReferences() {
    if (this.clientReferencesComponent && this.clientReferencesComponent.submitClientReferences) {
      this.clientReferencesComponent.submitClientReferences().then((success: boolean) => {
        if (success) {
          this.clientReferencesComponent.markAsSaved();
          this.stepper.next();
        }
        // If failed, the snackbar in the child will show the error
      });
    }
  }

  //company equity
  handleNextForCompanyEquity() {
    if (this.companyEquityComponent.isDirty) {
      this.companyEquityComponent.submit().then(success => {
        if (success) {
          this.companyEquityComponent.markAsSaved();
          this.stepper.next();
        }
      });
    } else {
      this.stepper.next();
    }
  }

  //technologyClassification
  handleNextForTechnologyClassification() {
    if (this.technologyClassificationComponent.isDirty) {
      this.technologyClassificationComponent.submitTechnologyClassifications().then(success => {
        if (success) {
          this.technologyClassificationComponent.markAsSaved();
          this.stepper.next();
        }
      });
    } else {
      this.stepper.next();
    }
  }

  handleNextForSectorExp() {
    if (this.sectorExperienceComponent?.isDirty) {
      this.sectorExperienceComponent.submitSectorExperience().then(success => {
        if (success) {
          this.sectorExperienceComponent.markAsSaved();
          this.stepper.next();
        }
      });
    } else {
      this.stepper.next();
    }
  }
  

  /* Dialog triggers */
  openDialogPreviousProjects() {
    this.dialog.open(PreviousprojectDialogComponent);
  }

  openDialogEnergyService() {
    this.dialog.open(EnergyserviceDialogComponent);
  }

  openDialogSectorExp(){
    this.dialog.open(SectorExpDialogComponent)
  }

  openDialogKeyEmployee() {
    this.dialog.open(KeyemplouyeeDialogComponent);
  }

  openDialogTechnologyClass(){
    this.dialog.open(TechnologyClassificationDialogComponent);
  }

  openDialogClientReferences() {
    this.dialog.open(ClientReferenceDialogComponent)
  }

  openDialogCompanyEq() {
    this.dialog.open(ClientReferenceDialogComponent)
  }

  openDialogCompanyInfo() {
    this.dialog.open(CompanyInformationDialogComponent);
  }


}