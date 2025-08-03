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
  ],
  templateUrl: "./previous-projects.component.html",
  styleUrl: "./previous-projects.component.scss",
})
export class PreviousProjectsComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  public noProjects = false;
  public maxtDate: Date = new Date();
  public maxEndDate: Date = new Date();

  public saveSuccessMessage: string | null = null;
  public saveErrorMessage: string | null = null;

  public deleteSuccessMessage: string | null = null;
  public deleteErrorMessage: string | null = null;

  esco_id = "ESCo-A023";
  //esco_id: string;

  constructor(
    private fb: FormBuilder,
    private createService: CreateService,
    private readService: ReadService,
    private validationService: ValidationsService,
    private deleteService: DeleteService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private updateService: UpdateService,
  ) {}

  ngOnInit() {
    // Only add a project if user says they DO have projects
    if (!this.noProjects && this.projectsArray.length === 0) {
      this.addProject();
    }
    this.patchPreviousProjects();

    console.log("Should show success toast now!");
    this.toastr.success("Projects deleted successfully.");
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
        pp_savingkilowatz: ["", [Validators.required]],
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

            // Optionally: show a message
            this.toastr.success("Projects deleted successfully.");
            this.deleteSuccessMessage = "Projects deleted successfully.";
            this.deleteErrorMessage = null;
            setTimeout(() => {
              this.deleteSuccessMessage = null;
            }, 3000);
          } else {
            this.toastr.error(
              "Failed to delete Previous Projects. Please Try again"
            );
            this.deleteSuccessMessage = null;
            this.deleteErrorMessage = `Failed to delete Previous Projects. Please Try again.`;
            setTimeout(() => {
              this.saveSuccessMessage = null;
            }, 3000);
          }
        },
        error: (err) => {
          this.toastr.error(
            "An error occurred while deleting Previous Projects."
          );

          this.deleteSuccessMessage = null;
          this.deleteErrorMessage = `An error occurred while deleting Previous Projects.`;
          setTimeout(() => {
            this.saveSuccessMessage = null;
          }, 3000);
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


  onSaveOrUpdateProject(i: number) {
    const projectGroup = this.projectsArray.at(i) as FormGroup;
    const project = projectGroup.value;
  
    const formData = new FormData();
    formData.append('esco_id', this.esco_id);
  
    // Append all fields
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
      // It's an update
      formData.append('pp_id', project.pp_id); // Backend needs to know
      this.updateService.StepUpdatePreviousProjects(formData).subscribe({
        next: (res) => {
          // Show success or error messages, reload data if needed, etc.
          this.toastr.success('Project updated successfully!');
          this.saveSuccessMessage = 'Project updated successfully!';
          setTimeout(() => this.saveSuccessMessage = null, 3000);
        },
        error: (err) => {
          this.toastr.error('Failed to update project.');
          this.saveErrorMessage = 'Failed to update project.';
          setTimeout(() => this.saveErrorMessage = null, 3000);
        }
      });
    } else {
      // It's a new add
      this.createService.StepSaveCompanyPreviousProjects(formData).subscribe({
        next: (res) => {
          this.toastr.success('Project saved successfully!');
          this.saveSuccessMessage = 'Project saved successfully!';
          setTimeout(() => this.saveSuccessMessage = null, 3000);
        },
        error: (err) => {
          this.toastr.error('Failed to save project.');
          this.saveErrorMessage = 'Failed to save project.';
          setTimeout(() => this.saveErrorMessage = null, 3000);
        }
      });
    }
  }
  

  // submitPreviousProjects() {
  //   if (this.parentForm.valid) {
  //     const formValue = this.parentForm.value;
  //     const projects = formValue.projects;
  //     let numSubmitted = 0;
  //     let numFailed = 0;

  //     projects.forEach((project: any, i: number) => {
  //       const formData = new FormData();
  //       formData.append("esco_id", this.esco_id);

  //       // Append all project fields
  //       formData.append("pp_client_name", project.pp_client_name);
  //       formData.append("pp_contact_person", project.pp_contact_person);
  //       formData.append("pp_client_contact_no", project.pp_client_contact_no);
  //       formData.append("pp_proj_desc", project.pp_proj_desc);
  //       formData.append("pp_contact_email", project.pp_contact_email);
  //       formData.append("pp_proj_value", project.pp_proj_value ?? "");
  //       formData.append("pp_savingkilowatz", project.pp_savingkilowatz ?? "");
  //       formData.append(
  //         "pp_proj_start_date",
  //         this.validationService.toMysqlDate(project.pp_proj_start_date)
  //       );
  //       formData.append(
  //         "pp_proj_end_date",
  //         this.validationService.toMysqlDate(project.pp_proj_end_date)
  //       );

  //       // Attach the reference letter if present
  //       if (project.pp_reference_letter) {
  //         formData.append("pp_reference_letter", project.pp_reference_letter);
  //       }

  //       // Call your API to save each project
  //       this.createService.StepSaveCompanyPreviousProjects(formData).subscribe({
  //         next: (res) => {
  //           if (res.status === "success") {
  //             numSubmitted++;
  //             if (numSubmitted + numFailed === projects.length) {
  //               // All projects processed
  //               this.saveSuccessMessage =
  //                 "Previous Projects successfully saved! Click Next to add more data.";
  //               this.saveErrorMessage = null;
  //               setTimeout(() => {
  //                 this.saveSuccessMessage = null;
  //               }, 3000);
  //             }
  //           } else {
  //             numFailed++;
  //             this.saveSuccessMessage = null;
  //             this.saveErrorMessage = `Failed to add some Previous Projects. Try again.`;
  //             setTimeout(() => {
  //               this.saveSuccessMessage = null;
  //             }, 3000);
  //           }
  //         },
  //         error: (err) => {
  //           numFailed++;
  //           this.saveSuccessMessage = null;
  //           this.saveErrorMessage =
  //             "An error occurred while adding Previous Projects.";
  //           setTimeout(() => {
  //             this.saveErrorMessage = null;
  //           }, 3000);
  //         },
  //       });
  //     });
  //   } else {
  //     this.parentForm.markAllAsTouched();
  //   }
  // }
}
