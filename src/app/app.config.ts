import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http'; // 👈 Add this
import { provideToastr } from 'ngx-toastr';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';


export const MY_DATE_FORMATS = {
    parse: { dateInput: 'DD/MM/YYYY' },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };


export const appConfig: ApplicationConfig = {
    providers: [provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes), 
        provideClientHydration(),
        provideAnimationsAsync(), 
        provideHttpClient(),
        provideToastr(),
        { provide: MAT_DATE_LOCALE, useValue: 'en-ZA' },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
        
    ]
};