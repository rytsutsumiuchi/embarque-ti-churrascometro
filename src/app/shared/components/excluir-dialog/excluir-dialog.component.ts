import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-excluir-dialog',
  standalone: true,
  imports: [ MatDialogModule, MatButtonModule, CommonModule ],
  templateUrl: './excluir-dialog.component.html',
  styleUrl: './excluir-dialog.component.scss'
})
export class ExcluirDialogComponent {
  constructor(public dialogRef: MatDialogRef<ExcluirDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}
