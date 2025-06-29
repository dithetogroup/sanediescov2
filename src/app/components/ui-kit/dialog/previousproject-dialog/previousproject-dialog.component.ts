import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-previousproject-dialog',
  imports: [],
  templateUrl: './previousproject-dialog.component.html',
  styleUrl: './previousproject-dialog.component.scss'
})
export class PreviousprojectDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<PreviousprojectDialogComponent>
) {}

  close(){
    this.dialogRef.close(true);
}

}
