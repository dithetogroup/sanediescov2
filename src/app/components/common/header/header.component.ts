import { Component, OnInit } from '@angular/core';
import { ToggleService } from './toggle.service';
import { NgClass, DatePipe, NgIf } from '@angular/common';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataSharingService } from '../services/data-sharing/data-sharing.service';
import { UserDataLogin } from '../../esco/escoInterfaces';

@Component({
    selector: 'app-header',
    imports: [RouterLink, NgClass, MatMenuModule, MatIconModule, MatButtonModule, DatePipe, NgIf],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent  implements OnInit{

    isToggled = false;

    userDetails: UserDataLogin | null = null;
    lastName: string = '';
    userRole: string = '';
    initials: string = ''; 
    firstName: string ='';
    esco_id: string = '';
    isESCoUser: boolean;
    isAdminValidator: boolean;
    isSuperAdmin: boolean;
    loading: boolean = true;

    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService,
        private dataSharingService: DataSharingService,
        
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }
 
    ngOnInit(): void {
        this.dataSharingService.userData$.subscribe(() => {
          const snapshot = this.dataSharingService.getUserSnapshot();
      
          this.userDetails = snapshot.userDetails;
          this.esco_id = snapshot.esco_id;
          this.firstName = snapshot.firstName;
          this.lastName = snapshot.lastName;
          this.initials = snapshot.initials;
          this.userRole = snapshot.userRole;
      
          this.isESCoUser = snapshot.roles.isESCoUser;
          this.isAdminValidator = snapshot.roles.isAdminValidator;
          this.isSuperAdmin = snapshot.roles.isSuperAdmin;
        });

        if (this.userDetails?.firstName && this.userDetails?.lastName) {
            this.initials = (this.firstName[0] + this.lastName[0]).toUpperCase();
        }
    }
      


    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggle() {
        this.toggleService.toggle();
    }

    toggleSidebarTheme() {
        this.themeService.toggleSidebarTheme();
    }

    toggleHideSidebarTheme() {
        this.themeService.toggleHideSidebarTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleHeaderTheme() {
        this.themeService.toggleHeaderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}