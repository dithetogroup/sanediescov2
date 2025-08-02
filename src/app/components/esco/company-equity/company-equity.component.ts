import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

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
  ],
  templateUrl: './company-equity.component.html',
  styleUrl: './company-equity.component.scss'
})
export class CompanyEquityComponent implements OnInit {

  @Input() companyEquityFormGroup!: FormGroup;

  equityOptions: string[] = [
    '0%',
    'less than 5%',
    '5% - 25%',
    '26% - 50%',
    '51% - 75%',
    '76% - 100%'
  ];

  isReadOnly = false;
  isVisible = true; // Use your logic for file/certificate display

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.companyEquityFormGroup.patchValue({
        ce_bee_equity_cert: file
      });
    }
  }

  submit(): void {
    if (this.companyEquityFormGroup.valid) {
      const data = this.companyEquityFormGroup.value;
      console.log('Company Equity Data:', data);
    }
  }
}
