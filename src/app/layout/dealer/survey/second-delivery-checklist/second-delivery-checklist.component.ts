import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { DocViewPopupComponent } from '../doc-view-popup/doc-view-popup.component';

@Component({
  selector: 'app-second-delivery-checklist',
  templateUrl: './second-delivery-checklist.component.html',
  styleUrls: ['./second-delivery-checklist.component.scss']
})
export class SecondDeliveryChecklistComponent implements OnChanges {

  @Input() checklistData: Array<any>;
  @Output() deliveryChecklist: EventEmitter<any> = new EventEmitter<any>();

  selectedIndex = 0;
  followUpData: Array<any> = [];
  questions: Array<any> = [];
  rolePermissions: any;
  constructor(
    private dialog: MatDialog,
    private user : UserService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.followUpData = this.checklistData.filter(function search(row): any {
      // function is used so we can use recursion (thus we can't use an arrow function)
      return Object.keys(row).some((key: any) => {
        if (typeof key === 'string' && key === 'MoveToFollowUp') {
          return row[key] === true;   // check MoveToFollowUp
        } else if (row[key] && typeof row[key] === 'object') {
          return search(row[key]);
          // do a recursive check
        }
        return false;
        // return false for any other type (not really necessary as undefined will be returned implicitly)
      });
    });
    this.rolePermissions = this.user.getRoleGroup();
  }

  /*** Check for Questions in Customer FollowUP ***/
  checkTabQuestion(rowData: any): boolean {
    const fields = rowData.Fields.filter(function search(row: any): any {
      // function is used so we can use recursion (thus we can't use an arrow function)
      return Object.keys(row).some((key: any) => {
        if (typeof key === 'string' && key === 'MoveToFollowUp') {
          return row[key] === true;   // check MoveToFollowUp
        } else if (row[key] && typeof row[key] === 'object') {
          return search(row[key]);
          // do a recursive check
        }
        return false;
        // return false for any other type (not really necessary as undefined will be returned implicitly)
      });
    });
    return !!fields.length;
  }
  /*** Check for Questions in Customer FollowUP ***/
  checkFieldQuestion(a: any): boolean {
    for (const i in a.Questions) {
      if (a.Questions[i].MoveToFollowUp) {
        return true;
      }
    }
    return false;
  }

  /*** Mark Question Completed ***/
  markComplete(evt: any, tabIndex: number, fieldIndex: number, quesIndex: number): void {
    this.checklistData[tabIndex].Fields[fieldIndex].Questions[quesIndex].Answer = evt.checked.toString();
  }

  /*** Mark All Question Completed ***/
  markAllComplete(tabIndex: number, fieldIndex: number): void {
    this.checklistData[tabIndex].Fields[fieldIndex].Questions.map((v: any) => {
      if (v.MoveToFollowUp) {
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

  /*** Submit Delivery Checklist ***/
  submitChecklist(): void {
    this.deliveryChecklist.emit(this.checklistData);
  }

}
