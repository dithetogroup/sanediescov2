import { Component } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DataSharingService } from '../../common/services/data-sharing/data-sharing.service';

@Component({
    selector: 'app-logout',
    imports: [RouterLink, MatButtonModule],
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

    constructor(
        public themeService: CustomizerSettingsService,
        private dataSharingService: DataSharingService,
        private router: Router
       ) {}


    ngOnInit(): void {
        this.dataSharingService.logout();
      //  this.router.navigate(['/authentication/login']);
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

}