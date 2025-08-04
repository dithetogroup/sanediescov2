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
import { MatSnackBar } from '@angular/material/snack-bar';


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
    public isDirty = false;
    public lastSavedAt: Date | null = null;

    latestFile: any = null;

    esco_id =  "ESCo-A001";

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
      private readService: ReadService,
      private snackBar: MatSnackBar
    ) {}
  
    ngOnInit(): void {

      this.loadLatestCompanyInfo();
      this.loadLatestFile();

      this.parentForm.addControl('ci_energy_man_exp', this.fb.control('', Validators.required));
      this.parentForm.addControl('ci_com_exp_of_tech_pro', this.fb.control('', Validators.required));
      this.parentForm.addControl('ci_business_activities_provinces', this.fb.control([], Validators.required));
      this.parentForm.addControl('ci_cicp_file', this.fb.control(null));

      this.parentForm.valueChanges.subscribe(() => {
        this.isDirty = this.parentForm.dirty;
      });
    }

    public markAsSaved() {
      this.isDirty = false;
      this.lastSavedAt = new Date();
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

    submitCompanyInformation(): Promise<boolean> {
      return new Promise((resolve) => {
        if (this.parentForm.valid) {
          const formValue = this.parentForm.value;
          const formData = new FormData();
    
          // Append fields as before...
          formData.append('esco_id', this.esco_id);
          formData.append('ci_energy_man_exp', formValue.ci_energy_man_exp);
          formData.append('ci_com_exp_of_tech_pro', formValue.ci_com_exp_of_tech_pro);
          formData.append('ci_business_activities_provinces', JSON.stringify(formValue.ci_business_activities_provinces));
          if (formValue.ci_cicp_file) {
            formData.append('ci_cicp_file', formValue.ci_cicp_file);
          }
    
          this.createService.StepSaveCompanyInformation(formData).subscribe({
            next: (res) => {
              if (res.status === 'success') {
                this.snackBar.open(
                  'Company Information successfully saved.',
                  'Close',
                  {
                     duration: 3500,
                    verticalPosition: 'top',
                    panelClass: ['snackbar-success'],
                  }
                );
                this.markAsSaved(); // <-- Reset dirty and set lastSavedAt
                resolve(true);
              } else {
                this.snackBar.open(
                  'Failed to add Company Information. Try again.',
                  'Close',
                  {
                    duration: 4000,
                    panelClass: ['snackbar-error'],
                  }
                );
                resolve(false);
              }
            },
            error: () => {
              this.snackBar.open(
                'An error occurred while adding the Company Information.',
                'Close',
                {
                  duration: 4000,
                  panelClass: ['snackbar-error'],
                }
              );
              resolve(false);
            },
          });
        } else {
          this.parentForm.markAllAsTouched();
          resolve(false);
        }
      });
    }
    
    
    

}
