import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ReadService } from '../../common/services/read/read.service';
import { ServicesOffered } from '../../../escoentities';
import { ValidationsService } from '../../common/services/utilities/validations.service';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-energy-service-offered',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatSlideToggle,
    MatButtonModule,
    MatIconModule,
],
  templateUrl: './energy-service-offered.component.html',
  styleUrl: './energy-service-offered.component.scss'
})
export class EnergyServiceOfferedComponent implements OnInit{

  @Input() parentForm!: FormGroup;
  public noEnergyOffered = false;

  serviceOfferings: string[] = [
    'Energy Auditing',
    'M&V of Energy Savings',
    'Engineering Design',
    'Project Implementation',
    'Energy Management',
    'Issuing of Energy Performance Certificates',
    'Energy Performance Contracts',
    'Financial modeling of energy projects',
    'Financing of Energy Projects',
    'Full ESCo Offering (provision of energy services and solutions)',
    'Other'
  ];
  

  selectedFile: File[] | [] = [];
  esco_id: string;
  //offeredservices: servicesOfferedValues [] = [];
  energyServicesOffered: ServicesOffered [] = [];
  serviceOfferedFormGroup: FormGroup;
  userDetails: any;
  isReadOnly: boolean = false;
  error: string = '';

  serviceOfferedForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private readService: ReadService,
    private validationService: ValidationsService
  ) {
    this.serviceOfferedForm = this.fb.group({
      so_isOther: [''],
      so_industry: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.parentForm.addControl('so_industry', this.fb.control('', Validators.required));
    this.parentForm.addControl('so_isOther', this.fb.control(''));
  //  this.loadServiceOffered();
  }

  onNoEnergyOfferedChange() {
    if (this.noEnergyOffered) {
      this.parentForm.reset();
      this.parentForm.disable();
    } else {
      this.parentForm.enable();
    }
  }

  submitServiceOffered() {
    if (this.parentForm.valid) {
      console.log('Submitted:', this.parentForm.value);
    } else {
      this.parentForm.markAllAsTouched();
    }
  }
  

  loadServiceOffered(): void {
    this.readService.getEscoEntity({ "entity": "services_offered", "esco_id": this.esco_id }).subscribe((response: any) => {
      this.energyServicesOffered = response as ServicesOffered[];      

      if (!this.validationService.isObjectNullUndefinedOrEmpty(response.message) && response.message === "no records found") {
        return;
      }

      this.isReadOnly = true;       
      const services: string[] = [];
      let serviceIsOther: string = '';

      this.energyServicesOffered.forEach(serviceOff => {
        let isOther: boolean = serviceOff.so_isOther.toString() === '0' ? false : true;
        if (isOther) {
          serviceIsOther = serviceOff.so_industry;
        } else {
          services.push(serviceOff.so_industry);
        }
      });      

      this.serviceOfferedFormGroup = this.fb.group({
        so_industry: [{ value: services, disabled: this.isReadOnly }],
        so_isOther: [{ value: serviceIsOther, disabled: this.isReadOnly }],
        esco_id: [this.esco_id],
      });      

      this.error = ''; // Reset error when users are found
    },
      (error) => {
        this.error = 'Sector Experience not found';
      }
    );
  }

}
