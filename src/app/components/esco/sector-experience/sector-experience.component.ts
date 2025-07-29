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
    MatSlideToggle,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './sector-experience.component.html',
  styleUrl: './sector-experience.component.scss'
})
export class SectorExperienceComponent {

  @Input() parentForm!: FormGroup;

  public noSectorExperience = false;

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
    private validationService: ValidationsService
  ) {}

  ngOnInit(): void {
    this.parentForm.addControl('se_experience', this.fb.control('', Validators.required));
    this.parentForm.addControl('se_isOther', this.fb.control(''));
  }

  onNoSectorExperienceChange() {
    if (this.noSectorExperience) {
      this.parentForm.reset();
      this.parentForm.disable();
    } else {
      this.parentForm.enable();
    }
  }

  submitSectorExperience() {
    if (this.parentForm.valid) {
      console.log('Sector Experience submitted:', this.parentForm.value);
    } else {
      this.parentForm.markAllAsTouched();
    }
  }

}
