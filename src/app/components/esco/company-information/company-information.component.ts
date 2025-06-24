import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerToggle, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EnumSAProvinces, EnumYearsInESCoBusiness, EnumTeamExperience } from '../../common/enums/app.enums';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-company-information',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,    
    MatIconModule,
    NgFor
],
  templateUrl: './company-information.component.html',
  styleUrl: './company-information.component.scss'
})
export class CompanyInformationComponent {

  companyInformationForm!: FormGroup; 
  EnumTeamExperience: string [];
  saProvinces: string[];
  yearsInESCoBusiness: string[];


  constructor(private fb: FormBuilder) {
    this.companyInformationForm = this.fb.group({
      ci_energy_man_exp: ['', Validators.required],
      ci_com_exp_of_tech_pro: ['', Validators.required],
      ci_business_activities_provinces: ['', Validators.required],
      ci_cicp_letter: [null]
    });

    this.yearsInESCoBusiness = Object.values(EnumYearsInESCoBusiness);
    this.EnumTeamExperience = Object.values(EnumTeamExperience);    
    this.saProvinces = Object.values(EnumSAProvinces);  
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.companyInformationForm.patchValue({ ci_cicp_letter: file });
    }
  }

  submitCompanyInformation() {
    console.log(this.companyInformationForm.value);
    // Submit using FormData object if uploading files
  }

}
