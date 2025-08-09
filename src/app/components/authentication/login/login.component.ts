import { Component } from "@angular/core";
import { CustomizerSettingsService } from "../../customizer-settings/customizer-settings.service";
import { Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormGroup, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Validators } from "ngx-editor";
import { AuthService } from "../../services/auth.service";
import { NgClass, NgIf } from "@angular/common";
import { ReadService } from "../../common/services/read/read.service";
import { DataSharingService } from "../../common/services/data-sharing/data-sharing.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-login",
  imports: [
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    NgIf,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  hide = true;
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = "";

  ClosedMessage: string | null = null;
  message: string | null = null;
  messageType: "success" | "error" | "warning" | null = null;

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private router: Router,
    private readService: ReadService,
    private dataSharing: DataSharingService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      lu_email: ["jason@escosa.co.za", Validators.required],
      lu_password: ["mypassword", Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    const { lu_email, lu_password } = this.loginForm.value;
  
    this.readService.Userlogin(lu_email, lu_password).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.status === 'success') {
          this.messageType = 'success';
         // this.message = "Login successful.";
          this.snackBar.open(
            'Login successful.',
            'Close',
            {
               duration: 3500,
              verticalPosition: 'top',
              panelClass: ['snackbar-error'],
            }
          );
          this.dataSharing.setUserData(data.user);
          this.router.navigate(['/forms/esco-profile']);
        } else {
          // Account is suspended
          if (data.message === "Sorry, your account is suspended") {
            this.snackBar.open(
              'Sorry, your account is suspended',
              'Close',
              {
                 duration: 3500,
                verticalPosition: 'top',
                panelClass: ['snackbar-error'],
              }
            );
            // this.message = data.message;
            // this.messageType = 'warning';
            setTimeout(() => {
              this.message = null;
              this.messageType = null;
            }, 5000);
          } else {
            this.message = `Login failed: ${data.message}`;
            this.messageType = 'error';
            setTimeout(() => {
              this.message = null;
              this.messageType = null;
            }, 5000);
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 403) {
          this.message = "Sorry, your account is suspended";
          this.messageType = 'warning';
        } else {
          this.message = 'Something went wrong. Please try again.';
          this.messageType = 'error';
        }
      }
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleCardBorderTheme() {
    this.themeService.toggleCardBorderTheme();
  }

  toggleCardBorderRadiusTheme() {
    this.themeService.toggleCardBorderRadiusTheme();
  }

  toggleRTLEnabledTheme() {
    this.themeService.toggleRTLEnabledTheme();
  }
}
