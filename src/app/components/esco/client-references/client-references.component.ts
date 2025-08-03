import { CommonModule, NgForOf, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDatepickerToggle,
} from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { CreateService } from "../../common/services/create/create.service";
import { ReadService } from "../../common/services/read/read.service";
import { ValidationsService } from "../../common/services/utilities/validations.service";
import { DeleteService } from "../../common/services/delete/delete.service";
import { ToastrService } from "ngx-toastr";
import { UpdateService } from "../../common/services/update/update.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MY_DATE_FORMATS } from "../../../app.config";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-client-references",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatDatepicker,
    MatDatepickerToggle,
    MatIcon,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatSlideToggle,
    MatDividerModule,
    NgIf,
    NgForOf,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: "./client-references.component.html",
  styleUrl: "./client-references.component.scss",
})
export class ClientReferencesComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  public noClientReferences = false;
  public maxDate: Date = new Date();
  public maxEndDate: Date = new Date();

  esco_id = "ESCo-A001";
  technologyClassifications = [
    "Solar PV", "Wind", "Biomass", "Hydro", "Storage", "Other"
  ]; // Example options

  constructor(
    private fb: FormBuilder,
    private createService: CreateService,
    private readService: ReadService,
    private validationService: ValidationsService,
    private deleteService: DeleteService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private updateService: UpdateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (!this.noClientReferences && this.clientReferencesArray.length === 0) {
      this.addClientReference();
    }
    this.patchClientReferences();
  }

  patchClientReferences() {
    this.readService.StepGetClientReferences(this.esco_id).subscribe((res) => {
      if (res.status === "success" && res.references.length > 0) {

        const refFormArray = this.parentForm.get("clientReferences") as FormArray;
        refFormArray.clear();
        res.references.forEach((ref: any) => {
          const group = this.createClientReferenceGroup();
          group.patchValue({
            cr_id: ref.cr_id,
            cr_client_name: ref.cr_client_name,
            cr_contact_person: ref.cr_contact_person,
            cr_client_contact_no: ref.cr_client_contact_no,
            cr_proj_desc: ref.cr_proj_desc,
            cr_technologies: ref.cr_technologies ? JSON.parse(ref.cr_technologies) : [],
            cr_proj_value: ref.cr_proj_value,
           // cr_start_date: ref.cr_start_date,
        //  cr_start_date: this.validationService.toDateObject(ref.cr_start_date),
          //cr_end_date: this.validationService.toDateObject(ref.cr_end_date),
            cr_start_date: ref.cr_start_date ? new Date(ref.cr_start_date) : null,
           cr_end_date: ref.cr_end_date ? new Date(ref.cr_end_date) : null,
          // cr_end_date: ref.cr_end_date,
          });
          if (ref.reference_letter) {
            group.patchValue({
              cr_reference_letter: ref.reference_letter.fu_path,
            });
          }
          refFormArray.push(group);
        });
      }
    });
  }

  onNoClientReferencesChange() {
    if (this.noClientReferences) {
      this.parentForm.reset();
      this.parentForm.disable();
    } else {
      this.parentForm.enable();
      if (this.clientReferencesArray.length === 0) {
        this.addClientReference();
      }
    }
  }

  toDateOnly(str: string): Date | null {
    if (!str) return null;
    // Extract YYYY-MM-DD only
    const d = str.split(' ')[0];
    return new Date(d);
  }
  

  createClientReferenceGroup(): FormGroup {
    return this.fb.group(
      {
        cr_id: [null],
        cr_client_name: ["", Validators.required],
        cr_contact_person: ["", Validators.required],
        cr_client_contact_no: [
          "",
          [Validators.required, Validators.pattern(/^\d{10}$/)],
        ],
        cr_proj_desc: ["", Validators.required],
        cr_technologies: [[], Validators.required],
        cr_proj_value: [""],
        cr_start_date: ["", Validators.required],
        cr_end_date: ["", Validators.required],
        cr_reference_letter: [null],
      },
      { validators: [this.endDateAfterStartDateValidator()] }
    );
  }

  endDateAfterStartDateValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get("cr_start_date")?.value;
      const end = group.get("cr_end_date")?.value;
      if (start && end && new Date(end) < new Date(start)) {
        return { endBeforeStart: true };
      }
      return null;
    };
  }

  get clientReferencesArray() {
    return this.parentForm.get("clientReferences") as FormArray;
  }

  addClientReference() {
    if (this.clientReferencesArray.length < 5) {
      this.clientReferencesArray.push(this.createClientReferenceGroup());
    }
  }

  removeClientReference(i: number) {
    const ref = this.clientReferencesArray.at(i).value;
    if (ref.cr_id) {
      debugger;
      this.deleteService.StepDeleteClientReferences(ref.cr_id, this.esco_id).subscribe({
        next: (res) => {
          if (res.status === "success") {
            this.clientReferencesArray.removeAt(i);
            this.cdr.detectChanges();
            this.snackBar.open('Client Reference saved successfully!', 'Close', {
              duration: 3500, // ms, adjust as you wish
              verticalPosition: 'top', // or 'bottom'
              panelClass: ['snackbar-success'] // add custom styling if you want
            });

          } else {

            this.snackBar.open('Error saving client reference!', 'Close', {
              duration: 4000,
              panelClass: ['snackbar-error']
            });
          }
        },
        error: (err) => {

          this.snackBar.open('An error occurred while deleting Client Reference!', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
        },
      });
    } else {
      this.clientReferencesArray.removeAt(i);
    }
  }

  onFileSelected(event: any, i: number) {
    const file = event.target.files[0];
    if (file) {
      this.clientReferencesArray.at(i).patchValue({ cr_reference_letter: file });
    }
  }

  onSaveOrUpdateClientReference(i: number) {
    const refGroup = this.clientReferencesArray.at(i) as FormGroup;
    const ref = refGroup.value;

    const formData = new FormData();
    formData.append('esco_id', this.esco_id);
    formData.append('cr_client_name', ref.cr_client_name);
    formData.append('cr_contact_person', ref.cr_contact_person);
    formData.append('cr_client_contact_no', ref.cr_client_contact_no);
    formData.append('cr_proj_desc', ref.cr_proj_desc);
    formData.append('cr_technologies', JSON.stringify(ref.cr_technologies));
    formData.append('cr_proj_value', ref.cr_proj_value ?? '');
    formData.append('cr_start_date', this.validationService.toMysqlDate(ref.cr_start_date));
    formData.append('cr_end_date', this.validationService.toMysqlDate(ref.cr_end_date));

    if (ref.cr_reference_letter) {
      formData.append('cr_reference_letter', ref.cr_reference_letter);
    }

    if (ref.cr_id) {
      formData.append('cr_id', ref.cr_id);
      this.updateService.StepUpdateClientReferences(formData).subscribe({
        next: (res) => {
          this.snackBar.open('Client Reference updated successfully!', 'Close', {
            duration: 3500, // ms, adjust as you wish
            verticalPosition: 'top', // or 'bottom'
            panelClass: ['snackbar-success'] // add custom styling if you want
          });
        },
        error: (err) => {
          this.snackBar.open('Failed to update Client Reference!', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      this.createService.StepSaveClientReferences(formData).subscribe({
        next: (res) => {
          this.snackBar.open('Client Reference saved successfully!', 'Close', {
            duration: 3500, // ms, adjust as you wish
            verticalPosition: 'top', // or 'bottom'
            panelClass: ['snackbar-success'] // add custom styling if you want
          });
        },
        error: (err) => {
          this.snackBar.open('Error saving client reference!', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  }
}
