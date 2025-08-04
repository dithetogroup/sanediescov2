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
import { MatNativeDateModule } from "@angular/material/core";
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
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-previous-projects",
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
    MatTooltipModule
  ],
  templateUrl: "./previous-projects.component.html",
  styleUrl: "./previous-projects.component.scss",
})
export class PreviousProjectsComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  public noProjects = false;
  public maxtDate: Date = new Date();
  public maxEndDate: Date = new Date();
  esco_id = "ESCo-A001";
  //esco_id: string;
  public isDirty = false;
  public lastSavedAt: Date | null = null;

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
    // Only add a project if user says they DO have projects
    if (!this.noProjects && this.projectsArray.length === 0) {
      this.addProject();
    }
    this.parentForm.valueChanges.subscribe(() => {
      this.isDirty = this.parentForm.dirty;
    });
    this.patchPreviousProjects();

    console.log("Should show success toast now!");
    this.toastr.success("Projects deleted successfully.");
  }

  public markAsSaved() {
    this.isDirty = false;
    this.lastSavedAt = new Date();
  }

  patchPreviousProjects() {
    this.readService.StepGetPreviousProjects(this.esco_id).subscribe((res) => {
      if (res.status === "success" && res.projects.length > 0) {
        const projectsFormArray = this.parentForm.get("projects") as FormArray;
        projectsFormArray.clear();
        res.projects.forEach((project: any) => {
          const group = this.createProjectGroup();
          // Patch normal fields
          group.patchValue({
            pp_id: project.pp_id, // Make sure to patch the ID!
            pp_client_name: project.pp_client_name,
            pp_contact_person: project.pp_contact_person,
            pp_client_contact_no: project.pp_client_contact_no,
            pp_proj_desc: project.pp_proj_desc,
            pp_contact_email: project.pp_contact_email,
            pp_proj_value: project.pp_proj_value,
            pp_savingkilowatz: project.pp_savingkilowatz,
            pp_proj_start_date: project.pp_proj_start_date,
            pp_proj_end_date: project.pp_proj_end_date,
          });
          // Reference letter: save tpp download URL or file meta info if needed
          if (project.reference_letter) {
            group.patchValue({
              pp_reference_letter: project.reference_letter.fu_path, // or tpp relevant URL field
            });
          }
          projectsFormArray.push(group);
        });
      }
    });
  }

  onNoProjectsChange() {
    if (this.noProjects) {
      this.parentForm.reset();
      this.parentForm.disable();
    } else {
      this.parentForm.enable();

      const projects = this.projectsArray;
      if (projects.length === 0) {
        this.addProject(); // Ensure one form is shown when toggle is OFF
      }
    }
  }

  createProjectGroup(): FormGroup {
    return this.fb.group(
      {
        pp_id: [null],
        pp_client_name: [
          "",
          [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)],
        ],
        pp_contact_person: [
          "",
          [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)],
        ],
        pp_client_contact_no: [
          "",
          [Validators.required, Validators.pattern(/^\d{10}$/)],
        ],
        pp_proj_desc: ["", Validators.required],
        pp_contact_email: ["", [Validators.required, Validators.email]],
        pp_proj_value: [""],
        pp_savingkilowatz: [""],
        pp_proj_start_date: ["", Validators.required],
        pp_proj_end_date: ["", Validators.required],
        pp_reference_letter: [null],
      },
      { validators: [this.endDateAfterStartDateValidator()] }
    );
  }

  // Custom validator: end date must be >= start date
  endDateAfterStartDateValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get("pp_proj_start_date")?.value;
      const end = group.get("pp_proj_end_date")?.value;
      if (start && end && new Date(end) < new Date(start)) {
        return { endBeforeStart: true };
      }
      return null;
    };
  }

  get projectsArray() {
    return this.parentForm.get("projects") as FormArray;
  }

  addProject() {
    if (this.projectsArray.length < 5) {
      this.projectsArray.push(this.createProjectGroup());
    }
  }

  removeProject(i: number) {
    const project = this.projectsArray.at(i).value;
    if (project.pp_id) {
      // It's an existing project from the database
      this.deleteService.StepDeletePreviousProject(project.pp_id).subscribe({
        next: (res) => {
          debugger;
          if (res.status === "success") {
            this.projectsArray.removeAt(i);
            this.cdr.detectChanges();
            this.snackBar.open('Projects deleted successfully!', 'Close', {
              duration: 3500, // ms, adjust as you wish
              verticalPosition: 'top', // or 'bottom'
              panelClass: ['snackbar-success'] // add custom styling if you want
            });
          } else {
          this.snackBar.open('Failed to delete Previous Projects. Please Try again', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
          }
        },
        error: (err) => {
          this.snackBar.open('An error occurred while deleting Previous Projects.', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
        },
      });
    } else {
      // Just remove from form if not yet saved
      this.projectsArray.removeAt(i);
    }
  }

  onFileSelected(event: any, i: number) {
    const file = event.target.files[0];
    if (file) {
      this.projectsArray.at(i).patchValue({ pp_reference_letter: file });
    }
  }


submitPreviousProjects(): Promise<boolean> {
  return new Promise(async (resolve) => {
    // If toggle is ON (noProjects), just resolve true
    if (this.noProjects) {
      resolve(true);
      return;
    }

    // Validate all project forms
    let allValid = true;
    for (let i = 0; i < this.projectsArray.length; i++) {
      const group = this.projectsArray.at(i) as FormGroup;
      group.markAllAsTouched();
      if (group.invalid) {
        allValid = false;
      }
    }
    if (!allValid) {
      this.snackBar.open('Please complete all project fields before continuing.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      resolve(false);
      return;
    }

    // Now, submit each project (either create or update as needed)
    // Wait for all to complete, fail fast if any fail
    let saveSuccess = true;
    for (let i = 0; i < this.projectsArray.length; i++) {
      const result = await this.saveOrUpdateProjectAsync(i);
      if (!result) {
        saveSuccess = false;
        break;
      }
    }
    resolve(saveSuccess);
  });
}

// Helper to handle saving a single project, returning a Promise<boolean>
private saveOrUpdateProjectAsync(i: number): Promise<boolean> {
  return new Promise((resolve) => {
    const projectGroup = this.projectsArray.at(i) as FormGroup;
    const project = projectGroup.value;
    const formData = new FormData();
    formData.append('esco_id', this.esco_id);

    formData.append('pp_client_name', project.pp_client_name);
    formData.append('pp_contact_person', project.pp_contact_person);
    formData.append('pp_client_contact_no', project.pp_client_contact_no);
    formData.append('pp_proj_desc', project.pp_proj_desc);
    formData.append('pp_contact_email', project.pp_contact_email);
    formData.append('pp_proj_value', project.pp_proj_value ?? '');
    formData.append('pp_savingkilowatz', project.pp_savingkilowatz ?? '');
    formData.append('pp_proj_start_date', this.validationService.toMysqlDate(project.pp_proj_start_date));
    formData.append('pp_proj_end_date', this.validationService.toMysqlDate(project.pp_proj_end_date));
    if (project.pp_reference_letter) {
      formData.append('pp_reference_letter', project.pp_reference_letter);
    }
    if (project.pp_id) {
      formData.append('pp_id', project.pp_id);
      formData.append('esco_id', project.esco_id);

      this.updateService.StepUpdatePreviousProjects(formData).subscribe({
        next: (res) => {
          if (res.status === "success") {
            resolve(true);
          } else {
            this.snackBar.open('Failed to update Previous Project. Please try again.', 'Close', {
              duration: 3500, panelClass: ['snackbar-error']
            });
            resolve(false);
          }
        },
        error: (err) => {
          this.snackBar.open('Failed to update Previous Project. Please try again.', 'Close', {
            duration: 3500, panelClass: ['snackbar-error']
          });
          resolve(false);
        }
      });
    } else {
      this.createService.StepSaveCompanyPreviousProjects(formData).subscribe({
        next: (res) => {
          if (res.status === "success") {
            resolve(true);
          } else {
            this.snackBar.open('Failed to save Previous Project. Please try again.', 'Close', {
              duration: 3500, panelClass: ['snackbar-error']
            });
            resolve(false);
          }
        },
        error: (err) => {
          this.snackBar.open('Failed to save Previous Project. Please try again.', 'Close', {
            duration: 3500, panelClass: ['snackbar-error']
          });
          resolve(false);
        }
      });
    }
  });
}

  
}
