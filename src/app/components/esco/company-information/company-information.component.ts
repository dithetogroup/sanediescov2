import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';
import { CreateService } from '../../common/services/create/create.service';
import { ReadService } from '../../common/services/read/read.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-company-information',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    NgFor,
    NgIf
],
  templateUrl: './company-information.component.html',
  styleUrl: './company-information.component.scss'
})
export class CompanyInformationComponent {

    @Input() parentForm!: FormGroup;
    @Output() fileUploaded = new EventEmitter<File>();
    public saveSuccessMessage: string | null = null;
    public saveErrorMessage: string | null = null;
    latestFile: any = null;

    esco_id =  "ESCo-A023";
    //esco_id: string;

    yearsInESCoBusiness: string[] = [
      '1 - 2', '3 - 5', '6 - 10', '10+'
    ];
    EnumTeamExperience: string[] = [
      '1 - 3', '4 -6 ', '7 - 10', '10+'
    ];
    saProvinces: string[] = [
      'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'
    ];
  
    constructor(private fb: FormBuilder,
      private createService: CreateService,
      private readService: ReadService
    ) {}
  
    ngOnInit(): void {

      this.loadLatestCompanyInfo();
      this.loadLatestFile();

      this.parentForm.addControl('ci_energy_man_exp', this.fb.control('', Validators.required));
      this.parentForm.addControl('ci_com_exp_of_tech_pro', this.fb.control('', Validators.required));
      this.parentForm.addControl('ci_business_activities_provinces', this.fb.control([], Validators.required));
      this.parentForm.addControl('ci_cicp_file', this.fb.control(null));

      this.parentForm.valueChanges.subscribe(() => {
        this.saveSuccessMessage = null;
        this.saveErrorMessage = null;
      })
    }
  
    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.parentForm.patchValue({ ci_cicp_file: file });
        this.fileUploaded.emit(file); // in case parent wants to listen
      }
    }


    loadLatestCompanyInfo() {
      this.readService.StepGetCompanyInformation(this.esco_id).subscribe(res => {
        if (res.status === 'success' && res.data) {
          // If provinces are stored as CSV, split them for the form
          if (res.data.ci_business_activities_provinces) {
            res.data.ci_business_activities_provinces =
              res.data.ci_business_activities_provinces.split(',');
          }
          
          this.parentForm.patchValue(res.data);
          console.log('fetched data', this.parentForm.patchValue(res.data));
        }
      });
    }

    loadLatestFile() {
      this.readService.StepGetCompanyInformationCICPFILE(this.esco_id).subscribe(res => {
        if (res.status === 'success' && res.data) {
          this.latestFile = res.data;
        } else {
          this.latestFile = null; // Clear if not found
        }
      });
    }


    get latestFileUrl(): string {
      if (!this.latestFile) return '';
      // Assuming fu_path is relative (e.g., "uploads/yourfile.pdf") and your API/baseUrl points to the server root
      return `${environment.baseUrl}/${this.latestFile.fu_path}`;
    }
    
  
    submitCompanyInformation() {
      if (this.parentForm.valid) {
        const formValue = this.parentForm.value;
        const formData = new FormData();
    
        // Append text fields
        formData.append('esco_id', this.esco_id);
        formData.append('ci_energy_man_exp', formValue.ci_energy_man_exp);
        formData.append('ci_com_exp_of_tech_pro', formValue.ci_com_exp_of_tech_pro);
        // For array fields, stringify or send individually as needed by your API
        formData.append('ci_business_activities_provinces', JSON.stringify(formValue.ci_business_activities_provinces));
    
        // Append file (if present)
        if (formValue.ci_cicp_file) {
          formData.append('ci_cicp_file', formValue.ci_cicp_file);
        }
    
        this.createService.StepSaveCompanyInformation(formData).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.saveSuccessMessage = 'Company Information successfully saved! Click Next to add more data.';
              this.saveErrorMessage = null;
              setTimeout(() => {
                this.saveSuccessMessage = null;
              }, 3000);
            } else {
              this.saveSuccessMessage = null;
              this.saveErrorMessage = 'Failed to add Company Information. Try again.';
              setTimeout(() => {
                this.saveErrorMessage = null;
              }, 3000);
            }
          },
          error: (err) => {
            console.error("Error adding Company Information:", err);
            this.saveSuccessMessage = null;
            this.saveErrorMessage = 'An error occurred while adding the Company Information.';
            setTimeout(() => {
              this.saveErrorMessage = null;
            }, 3000);
          }
        });
    
      } else {
        this.parentForm.markAllAsTouched();
      }
    }
    

}
