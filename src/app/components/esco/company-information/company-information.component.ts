import { Component, EventEmitter, Input, Output } from '@angular/core';
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
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
],
  templateUrl: './company-information.component.html',
  styleUrl: './company-information.component.scss'
})
export class CompanyInformationComponent {

    @Input() parentForm!: FormGroup;
    @Output() fileUploaded = new EventEmitter<File>();
  
    yearsInESCoBusiness: string[] = [
      '1-2', '3-5', '6-10', '10+'
    ];
    EnumTeamExperience: string[] = [
      '1-3', '4-6', '7-10', '10+'
    ];
    saProvinces: string[] = [
      'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'
    ];
  
    constructor(private fb: FormBuilder) {}
  
    ngOnInit(): void {
      this.parentForm.addControl('ci_energy_man_exp', this.fb.control('', Validators.required));
      this.parentForm.addControl('ci_com_exp_of_tech_pro', this.fb.control('', Validators.required));
      this.parentForm.addControl('ci_business_activities_provinces', this.fb.control([], Validators.required));
      this.parentForm.addControl('ci_cicp_file', this.fb.control(null));
    }
  
    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.parentForm.patchValue({ ci_cicp_file: file });
        this.fileUploaded.emit(file); // in case parent wants to listen
      }
    }
  
    submitCompanyInformation() {
      if (this.parentForm.valid) {
        // You can emit or handle the form data as you want
        console.log('Company Information submitted:', this.parentForm.value);
      } else {
        this.parentForm.markAllAsTouched();
      }
    }

}
