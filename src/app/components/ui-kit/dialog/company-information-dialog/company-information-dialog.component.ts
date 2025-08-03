import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-company-information-dialog',
  imports: [],
  templateUrl: './company-information-dialog.component.html',
  styleUrl: './company-information-dialog.component.scss'
})
export class CompanyInformationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CompanyInformationDialogComponent>
) {}


  close(){
    this.dialogRef.close(true);
}

}
