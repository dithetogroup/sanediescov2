import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-technology-classification-dialog',
  imports: [],
  templateUrl: './technology-classification-dialog.component.html',
  styleUrl: './technology-classification-dialog.component.scss'
})
export class TechnologyClassificationDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<TechnologyClassificationDialogComponent>
) {}

  close(){
    this.dialogRef.close(true);
}

}
