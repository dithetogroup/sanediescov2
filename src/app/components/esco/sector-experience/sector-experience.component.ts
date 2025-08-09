import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ValidationsService } from '../../common/services/utilities/validations.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateService } from '../../common/services/create/create.service';
import { DataSharingService } from '../../common/services/data-sharing/data-sharing.service';
import { ReadService } from '../../common/services/read/read.service';
import { UserDataLogin } from '../escoInterfaces';

@Component({
  selector: 'app-sector-experience',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './sector-experience.component.html',
  styleUrl: './sector-experience.component.scss'
})
export class SectorExperienceComponent {

  @Input() sectorExperienceFormGroup!: FormGroup;
  public isDirty = false;
  public lastSavedAt: Date | null = null;
  public noSectorExperience = false;
  esco_id: string = '';
  userDetails: UserDataLogin | null = null;

  sectorsExperienced: string[] = [
    'Mining',
    'Manufacturing',
    'Agriculture',
    'Water and Sanitation',
    'Healthcare',
    'Transport',
    'Education',
    'Residential',
    'Retail',
    'Hospitality',
    'Government',
    'Other'
  ];

  constructor(
    private fb: FormBuilder, 
    private validationService: ValidationsService,
    private createService: CreateService,
    private snackBar: MatSnackBar,
    private dataSharing: DataSharingService,
    private readService: ReadService,
    private dataSharingService: DataSharingService

  ) {}

  ngOnInit(): void {

    this.dataSharingService.userData$.subscribe(() => {
      const snapshot = this.dataSharingService.getUserSnapshot();
      this.userDetails = snapshot.userDetails;
      this.esco_id = snapshot.esco_id;
    });

    // ensure controls exist
    if (!this.sectorExperienceFormGroup.get('se_industry')) {
      this.sectorExperienceFormGroup.addControl('se_industry', this.fb.control<string[]>([], Validators.required));
    }
    if (!this.sectorExperienceFormGroup.get('se_isOther')) {
      this.sectorExperienceFormGroup.addControl('se_isOther', this.fb.control(''));
    }
    if (!this.sectorExperienceFormGroup.get('se_id')) {
      this.sectorExperienceFormGroup.addControl('se_id', this.fb.control(null));
    }

    // toggle “Other” requirement
    this.sectorExperienceFormGroup.get('se_industry')!.valueChanges.subscribe((val: string[] = []) => {
      const otherCtrl = this.sectorExperienceFormGroup.get('se_isOther')!;
      if (val.includes('Other')) {
        otherCtrl.addValidators(Validators.required);
      } else {
        otherCtrl.clearValidators();
      }
      otherCtrl.updateValueAndValidity({ emitEvent: false });
    });

    // track dirty state
    this.sectorExperienceFormGroup.valueChanges.subscribe(() => {
      this.isDirty = this.sectorExperienceFormGroup.dirty;
    });

    // 🔹 Patch data by esco_id
    this.patchSectorExperienceByEsco();
  }

  private parseExperiences(input: any): string[] {
    if (!input) return [];
    if (Array.isArray(input)) return input.filter(Boolean);

    if (typeof input === 'string') {
      const raw = input.trim();
      // try JSON first
      if (raw.startsWith('[') || raw.startsWith('"')) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed.filter(Boolean);
          if (typeof parsed === 'string') return [parsed].filter(Boolean);
        } catch { /* fallback */ }
      }
      // fallback CSV or single token
      return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }


  private patchSectorExperienceByEsco(): void {
    if (!this.esco_id) return;

    this.readService.StepGetSectorExperience(this.esco_id).subscribe({
      next: (res: any) => {
        // adapt to your actual response shape
        const rows = res?.data || res?.experience || res?.result || [];
        if (res?.status === 'success' && Array.isArray(rows) && rows.length) {
          const row = rows[0]; // assuming one row per esco_id

         // const experiences = this.parseExperiences(row.se_industry);
          const experiences = this.parseExperiences(row.se_industry_json_or_csv);
          this.sectorExperienceFormGroup.patchValue({
            se_id: row.id,
            se_industry: experiences,
            se_isOther: row.other_text
          });

          // Re-apply “Other” validator if needed (in case valueChanges didn’t fire yet)
          const otherCtrl = this.sectorExperienceFormGroup.get('se_isOther')!;
          if (experiences.includes('Other')) {
            otherCtrl.addValidators(Validators.required);
          } else {
            otherCtrl.clearValidators();
          }
          otherCtrl.updateValueAndValidity({ emitEvent: false });

          // mark pristine after patch
          this.sectorExperienceFormGroup.markAsPristine();
          this.isDirty = false;
        }
      },
      error: () => {
        // optional: toast/log if needed
      }
    });
  }

  public markAsSaved() {
    this.isDirty = false;
    this.lastSavedAt = new Date();
  }


  submitSectorExperience(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.sectorExperienceFormGroup.valid) {
        const data = this.sectorExperienceFormGroup.value;
        const formData = new FormData();

        // Required base fields
        formData.append('esco_id', this.esco_id);

        // Multi-select: send JSON array (or CSV if your API expects it)
        const experiences: string[] = Array.isArray(data.se_industry) ? data.se_industry : [];
        formData.append('se_industry', JSON.stringify(experiences));
        // If your API wants CSV instead, use:
        // formData.append('se_industry', experiences.join(','));

        formData.append('se_isOther', data.se_isOther || '');



        // Optional: editing existing record
        if (data.se_id) formData.append('se_id', data.se_id);

        debugger;

        this.createService.StepSaveSectorExperience(formData).subscribe({
          next: (res: any) => {
            if (res.status === 'success') {
              this.snackBar.open('Sector Experience successfully saved!', 'Close', {
                duration: 3500,
                verticalPosition: 'top',
                panelClass: ['snackbar-success']
              });
              this.markAsSaved();
              resolve(true);
            } else {
              this.snackBar.open('Failed to save Sector Experience. Try again.', 'Close', {
                duration: 4000,
                panelClass: ['snackbar-error']
              });
              resolve(false);
            }
          },
          error: () => {
            this.snackBar.open('An error occurred while saving Sector Experience.', 'Close', {
              duration: 4000,
              panelClass: ['snackbar-error']
            });
            resolve(false);
          }
        });
      } else {
        this.sectorExperienceFormGroup.markAllAsTouched();
        resolve(false);
      }
    });
  }

}
