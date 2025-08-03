import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CreateService } from '../../common/services/create/create.service';
import { ReadService } from '../../common/services/read/read.service';
import { DeleteService } from '../../common/services/delete/delete.service';
import { UpdateService } from '../../common/services/update/update.service';

import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../../environments/environment';
import { ValidationsService } from '../../common/services/utilities/validations.service';

@Component({
  selector: 'app-key-employees',
  templateUrl: './key-employees.component.html',
  styleUrl: './key-employees.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatDividerModule,
    NgIf,
    NgForOf,
    MatTooltipModule,
    MatSnackBarModule
  ],
})
export class KeyEmployeesComponent implements OnInit {

  @Input() parentForm!: FormGroup;
  public maxtDate: Date = new Date();
  public noKeyEmployees = false;
  public esco_id = "ESCo-A001"; // You may want to inject or @Input this
  public fileMeta: { [index: number]: { cv?: any; certifications?: any[]; epc_letter?: any } } = {};

  constructor(
    private fb: FormBuilder,
    private createService: CreateService,
    private readService: ReadService,
    private updateService: UpdateService,
    private deleteService: DeleteService,
    private snackBar: MatSnackBar,
    private validationService: ValidationsService
  ) {}

  ngOnInit() {
    if (!this.noKeyEmployees && this.keyemployeesArray.length === 0) {
      this.addKeyEmployee();
    }
    this.patchKeyEmployees();
  }

  get keyemployeesArray() {
    return this.parentForm.get('keyemployees') as FormArray;
  }

  createEmployeeGroup(): FormGroup {
    return this.fb.group({
      ke_id: [null],
      ke_full_names: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      ke_id_no: [''],
      ke_no_yrs_firm: ['', Validators.required],
      ke_highest_education: ['', Validators.required],
      ke_add_traing_certs: [''],
      ke_no_of_yrs_energy: ['', Validators.required],
      ke_id_type: [''],
      ke_epc_professional_registered: ['No', Validators.required], // Yes/No
      ke_is_new_job: ['No', Validators.required],
      ke_emp_cv: [null],              // File
      ke_certification: [null],       // Array of Files
      ke_epc_professional_letter: [null], // File
    });
  }

  addKeyEmployee() {
    if (this.keyemployeesArray.length < 5) {
      this.keyemployeesArray.push(this.createEmployeeGroup());
    }
  }

  removeKeyEmployee(index: number) {
    const group = this.keyemployeesArray.at(index);
    const ke_id = group.get('ke_id')?.value;
    if (ke_id) {
      this.deleteService.StepDeleteKeyEmployee(ke_id, this.esco_id).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.keyemployeesArray.removeAt(index);
            this.snackBar.open('Key Employee deleted successfully', 'Close', {duration: 3500, panelClass: ['snackbar-success']});
          } else {
            this.snackBar.open('Failed to delete Key Employee', 'Close', {duration: 3500, panelClass: ['snackbar-error']});
          }
        },
        error: () => {
          this.snackBar.open('Error occurred while deleting', 'Close', {duration: 3500, panelClass: ['snackbar-error']});
        }
      });
    } else {
      this.keyemployeesArray.removeAt(index);
    }
  }

  // File handling - multi for certifications
  onFileSelected(event: any, i: number, type: 'cv' | 'certification' | 'epc_letter') {
    const files = event.target.files;
    if (!files) return;
    if (type === 'certification') {
      this.keyemployeesArray.at(i).patchValue({ ke_certification: files });
    } else if (type === 'cv') {
      this.keyemployeesArray.at(i).patchValue({ ke_emp_cv: files[0] });
    } else if (type === 'epc_letter') {
      this.keyemployeesArray.at(i).patchValue({ ke_epc_professional_letter: files[0] });
    }
  }

  // Remove an individual uploaded file (soft delete)
  removeUploadedFile(fileId: number, i: number, fileType: 'cv' | 'certification' | 'epc_letter') {
    this.deleteService.StepDeleteEmployeeFile(fileId).subscribe({
      next: res => {
        if (res.status === 'success') {
          // Remove from fileMeta
          if (fileType === 'cv') this.fileMeta[i].cv = null;
          if (fileType === 'epc_letter') this.fileMeta[i].epc_letter = null;
          if (fileType === 'certification') {
            this.fileMeta[i].certifications = (this.fileMeta[i].certifications || []).filter((c: any) => c.fu_id !== fileId);
          }
          this.snackBar.open('File removed', 'Close', {duration: 2500, panelClass: ['snackbar-success']});
        }
      },
      error: () => {
        this.snackBar.open('Could not remove file', 'Close', {duration: 3000, panelClass: ['snackbar-error']});
      }
    });
  }

  // Save/Update handler
  onSaveOrUpdateKeyEmployee(i: number) {
    const group = this.keyemployeesArray.at(i) as FormGroup;
    if (group.invalid) return;

    const data = group.value;
    const formData = new FormData();
    formData.append('esco_id', this.esco_id);

    if (data.ke_id) formData.append('ke_id', data.ke_id);

    formData.append('ke_full_names', data.ke_full_names || '');
    formData.append('ke_id_no', data.ke_id_no || '');
    //formData.append('ke_no_yrs_firm', data.ke_no_yrs_firm || '');
    formData.append('ke_no_yrs_firm', this.validationService.toMysqlDate(data.ke_no_yrs_firm));
    formData.append('ke_highest_education', data.ke_highest_education || '');
    formData.append('ke_add_traing_certs', data.ke_add_traing_certs || '');
    formData.append('ke_no_of_yrs_energy', data.ke_no_of_yrs_energy || '');
    formData.append('ke_id_type', data.ke_id_type || '');
    formData.append('ke_epc_professional_registered', data.ke_epc_professional_registered || '');
    formData.append('ke_is_new_job', data.ke_is_new_job || '');

    // CV file
    if (data.ke_emp_cv) formData.append('ke_emp_cv', data.ke_emp_cv);

    // Multiple certifications
    if (data.ke_certification && data.ke_certification.length) {
      for (let c of Array.from(data.ke_certification)) {
        if (c instanceof File) {
          formData.append('ke_certification[]', c);
        }
      }
    }
    

    // EPC letter
    if (data.ke_epc_professional_letter) formData.append('ke_epc_professional_letter', data.ke_epc_professional_letter);

    this.createService.StepSaveKeyEmployee(formData).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.snackBar.open('Key Employee saved!', 'Close', {duration: 3000, panelClass: ['snackbar-success']});
          // Optionally patch latest
          this.patchKeyEmployees();
        } else {
          this.snackBar.open('Save failed: ' + res.message, 'Close', {duration: 3500, panelClass: ['snackbar-error']});
        }
      },
      error: () => {
        this.snackBar.open('Save failed. Server error.', 'Close', {duration: 3500, panelClass: ['snackbar-error']});
      }
    });
  }

  // Fetch from API and patch FormArray and fileMeta
  patchKeyEmployees() {
    this.readService.StepGetKeyemployee(this.esco_id).subscribe(res => {
      if (res.status === 'success' && res.key_employees.length > 0) {
        const arr = this.keyemployeesArray;
        arr.clear();
        this.fileMeta = {};
        res.key_employees.forEach((emp: any, idx: number) => {
          const group = this.createEmployeeGroup();
          group.patchValue({
            ke_id: emp.ke_id,
            ke_full_names: emp.ke_full_names,
            ke_id_no: emp.ke_id_no,
            ke_no_yrs_firm: emp.ke_no_yrs_firm ? new Date(emp.ke_no_yrs_firm) : '',
            ke_highest_education: emp.ke_highest_education,
            ke_add_traing_certs: emp.ke_add_traing_certs,
            ke_no_of_yrs_energy: emp.ke_no_of_yrs_energy,
            ke_id_type: emp.ke_id_type,
            ke_epc_professional_registered: emp.ke_epc_professional_registered,
            ke_is_new_job: emp.ke_is_new_job,
            // Don't patch files directly!
          });
          arr.push(group);
          // Store file metadata for download/remove
          this.fileMeta[idx] = {
            cv: emp.cv || null,
            certifications: emp.certifications || [],
            epc_letter: emp.epc_letter || null
          };
        });
      }
    });
  }

  // Helper to get download URL for a file meta
  getFileUrl(file: any): string {
    if (!file || !file.fu_path) return '';
    return `${environment.baseUrl}/${file.fu_path}`;
  }

}
