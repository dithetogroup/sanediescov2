import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateService } from '../../common/services/create/create.service';
import { ReadService } from '../../common/services/read/read.service';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-company-equity',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgFor,
    NgIf
  ],
  templateUrl: './company-equity.component.html',
  styleUrl: './company-equity.component.scss'
})
export class CompanyEquityComponent implements OnInit {

  @Input() companyEquityFormGroup!: FormGroup;
  public isDirty = false;
  public lastSavedAt: Date | null = null;

  equityOptions: string[] = [
    '0%',
    'less than 5%',
    '5% - 25%',
    '26% - 50%',
    '51% - 75%',
    '76% - 100%'
  ];

  isReadOnly = false;
  esco_id =  "ESCo-A001";
  latestBeeFile: any = null;
  selectedFile: File | null = null;
  isVisible = true; 
  latestFile: any = null;

  ngOnInit(){
    this.loadAndPatchCompanyEquity();
      // Track dirtiness of the form
    this.companyEquityFormGroup.valueChanges.subscribe(() => {
      this.isDirty = this.companyEquityFormGroup.dirty;
    });
  }

  public markAsSaved() {
    this.isDirty = false;
    this.lastSavedAt = new Date();
  }

  constructor(private fb: FormBuilder,
    private createService: CreateService,
    private readService: ReadService,
    private snackBar: MatSnackBar
  ) {}


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('File selected:', file);  // <--- debug log
    }
  }

  get latestBeeFileUrl(): string {
    if (!this.latestBeeFile) return '';
    return `${environment.baseUrl}/${this.latestBeeFile.fu_path}`;
  }
  
  

  loadAndPatchCompanyEquity() {
    this.readService.StepGetCompanyEquiity(this.esco_id).subscribe(res => {
      if (res.status === 'success' && res.company_equity) {
        const equity = res.company_equity;
        this.companyEquityFormGroup.patchValue({
          ce_id: equity.ce_id,
          ce_woman_owned: equity.ce_woman_owned,
          ce_black_owned: equity.ce_black_owned,
          ce_youth_owned: equity.ce_youth_owned,
          // Do NOT patch the file input directly, just store meta for UI
        });
        // Store file meta for download (do not patch into the FormGroup)
        this.latestBeeFile = equity.bee_certificate ?? null;
      }
    });
  }

  submit(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.companyEquityFormGroup.valid) {
        const data = this.companyEquityFormGroup.value;
        const formData = new FormData();
  
        formData.append('esco_id', this.esco_id);
        formData.append('ce_woman_owned', data.ce_woman_owned || '');
        formData.append('ce_black_owned', data.ce_black_owned || '');
        formData.append('ce_youth_owned', data.ce_youth_owned || '');
        if (data.ce_id) formData.append('ce_id', data.ce_id);
  
        if (this.selectedFile) {
          formData.append('ce_bee_equity_cert', this.selectedFile);
        }
  
        this.createService.StepSaveCompanyEquiity(formData).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.snackBar.open('Company Equity successfully saved!', 'Close', {
                duration: 3500,
                verticalPosition: 'top',
                panelClass: ['snackbar-success']
              });
              this.markAsSaved(); // Track state!
              resolve(true);
            } else {
              this.snackBar.open('Failed to save Company Equity. Try again.', 'Close', {
                duration: 4000,
                panelClass: ['snackbar-error']
              });
              resolve(false);
            }
          },
          error: () => {
            this.snackBar.open('An error occurred while saving Company Equity.', 'Close', {
              duration: 4000,
              panelClass: ['snackbar-error']
            });
            resolve(false);
          }
        });
      } else {
        this.companyEquityFormGroup.markAllAsTouched();
        resolve(false);
      }
    });
  }
  
  
}
