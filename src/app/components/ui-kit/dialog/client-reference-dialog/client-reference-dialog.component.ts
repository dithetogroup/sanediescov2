import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-client-reference-dialog',
  imports: [],
  templateUrl: './client-reference-dialog.component.html',
  styleUrl: './client-reference-dialog.component.scss'
})
export class ClientReferenceDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<ClientReferenceDialogComponent>
) {}


  close(){
    this.dialogRef.close(true);
}

}
