import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { DocViewPopupComponent } from '../doc-view-popup/doc-view-popup.component';

@Component({
  selector: 'app-delivery-checklist',
  templateUrl: './delivery-checklist.component.html',
  styleUrls: ['./delivery-checklist.component.scss']
})
export class DeliveryChecklistComponent implements OnInit {

  @Input() checklistData: Array<any>;
  @Input() totalTime: any;
  @Output() deliveryChecklist: EventEmitter<any> = new EventEmitter<any>();

  selectedIndex = 0;
  rolePermissions: any;

  constructor(
    private dialog: MatDialog,
    private user : UserService
  ) { }

  ngOnInit(): void {
    this.rolePermissions = this.user.getRoleGroup();
  }

  /*** SMark Question Complete ***/
  markComplete(evt: any, tabIndex: number, fieldIndex: number, quesIndex: number): void {
    this.checklistData[tabIndex].Fields[fieldIndex].Questions[quesIndex].Answer = evt.checked.toString();
  }

  /*** Mark All Questions Complete ***/
  markAllComplete(tabIndex: number, fieldIndex: number): void {
    this.checklistData[tabIndex].Fields[fieldIndex].Questions.map((v: any) => {
      if (v.MoveToFollowUp) {
        v.Answer = 'false';
      } else {
        v.Answer = 'true';
      }
    });
  }

  /*** View Documents ***/
  openDocument(document: any): void {
    if (document.FileType.includes('image') || document.FileType.includes('video')) {
      const dialogRef = this.dialog.open(DocViewPopupComponent, { data: { document }, panelClass: 'custom-modalbox' });
    } else {
      const url = environment.BASE_DOC_URL + document.FileSubPath + '/' + document.FileName;
      window.open(document.FileFullPath, '_blank');
    }
  }

  /*** Move/Remove Question to Customer Follow-Up ***/
  moveToCustomer(tabIndex: number, fieldIndex: number, quesIndex: number, val: boolean): void {
    console.log(val);

    this.checklistData[tabIndex].Fields[fieldIndex].Questions[quesIndex].MoveToFollowUp = val;
    if (val) {
      this.checklistData[tabIndex].Fields[fieldIndex].Questions[quesIndex].Answer = 'false';
    }
  }

  /*** On Tab Change ***/
  tabChanged(tabChangeEvent: any): void {
    this.selectedIndex = tabChangeEvent.index;
  }

  /*** Submit Delivery CheckList ***/
  submitChecklist(): void {
    this.deliveryChecklist.emit(this.checklistData);
  }

}
