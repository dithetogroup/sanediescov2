import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-energyservice-dialog",
  imports: [],
  templateUrl: "./energyservice-dialog.component.html",
  styleUrl: "./energyservice-dialog.component.scss",
})
export class EnergyserviceDialogComponent {
  constructor(public dialogRef: MatDialogRef<EnergyserviceDialogComponent>) {}

  close() {
    this.dialogRef.close(true);
  }
}
