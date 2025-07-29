import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-keyemplouyee-dialog',
  imports: [],
  templateUrl: './keyemplouyee-dialog.component.html',
  styleUrl: './keyemplouyee-dialog.component.scss'
})
export class KeyemplouyeeDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<KeyemplouyeeDialogComponent>
) {}

  close(){
    this.dialogRef.close(true);
}

}
