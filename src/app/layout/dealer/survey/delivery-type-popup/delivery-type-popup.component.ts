import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delivery-type-popup',
  templateUrl: './delivery-type-popup.component.html',
  styleUrls: ['./delivery-type-popup.component.scss']
})
export class DeliveryTypePopupComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DeliveryTypePopupComponent>
  ) { }

  ngOnInit(): void {
  }

  /*** Send Documents ***/
  sendDocuments(type: number): void {
    this.dialogRef.close(type);
  }
}
