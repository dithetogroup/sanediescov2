import { Component } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCheckboxModule, NgIf, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    hide = true;
    loginForm: FormGroup;
    isLoading = false;
    errorMessage = '';

    constructor(
        public themeService: CustomizerSettingsService,
        private fb: FormBuilder, private authService: AuthService, private router: Router
        
    ) {
        this.loginForm = this.fb.group({
            lu_email: ['mathipa87@gmail.commo', Validators.required],
            lu_password: ['testing123', Validators.required]
          });
    }

    onSubmit() {
        if (this.loginForm.invalid) {
          return;
        }
     //   this.isLoading = true;
    //    this.errorMessage = '';
    
        this.authService.login(this.loginForm.value).subscribe({
          
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/']); // Redirect to homepage or dashboard
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error.message || 'Login failed';
          }
        });
      }

      onTest() {
        this.authService.testConnection().subscribe({
          next: (res) => {
            console.log('✅ Laravel API is reachable:', res);
          },
          error: (err) => {
            console.error('❌ Failed to connect to Laravel:', err);
          }
        });
        
      }

      testApi() {
        this.authService.testConnection().subscribe({
          next: (res) => console.log('✅ Test OK:', res),
          error: (err) => console.error('❌ CORS or server issue:', err)
        });
      }

      testFree(){
        this.authService.testPing().subscribe({
          next: (res) => console.log('✅ API OK:', res),
          error: (err) => console.error('❌ Still blocked:', err)
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