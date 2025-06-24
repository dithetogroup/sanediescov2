import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-po-stats',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './po-stats.component.html',
    styleUrls: ['./po-stats.component.scss']
})
export class PoStatsComponent {}