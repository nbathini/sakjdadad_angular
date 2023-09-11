import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { appConfig } from 'src/app/core/app-conf';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnChanges {

  @Input() checklistData: Array<any>;
  @Output() sendDocuments: EventEmitter<any> = new EventEmitter<any>();
  documentsData: Array<any> = [];
  selectedDocs: Array<number> = [];
  selectedLinks: Array<number> = [];
  rolePermissions: any;
  disableMode= true;
  appConfig = appConfig;
  constructor(
    private user : UserService
  ) { }

  ngOnChanges(): void {
    this.selectedDocs = [];
    this.selectedLinks = [];
    this.documentsData = this.checklistData.filter(function search(row): any {
      // function is used so we can use recursion (thus we can't use an arrow function)
      return Object.keys(row).some((key: any) => {
        if (typeof key === 'string' && (key === 'Documents' || key === 'Links')) {
          return row[key].length;   // check MoveToFollowUp
        } else if (row[key] && typeof row[key] === 'object') {
          // do a recursive check
          return search(row[key]);
        }
        // return false for any other type (not really necessary as undefined will be returned implicitly)
        return false;
      });
    });
    this.rolePermissions = this.user.getRoleGroup();
    if(this.rolePermissions?.isCreate || this.rolePermissions?.isEdit){ this.disableMode = false;}
  }

  /*** Check If Documents Or Links Exist ***/
  checkFieldDocumentsNLinks(a: any): boolean {
    for (const i in a.Questions) {
      if (a.Questions[i].Documents.length || a.Questions[i].Links.length) {
        return true;
      }
    }
    return false;
  }

  /*** Select Document to Send ***/
  selectDocument(evt: any, id: number): void {
    const index = this.selectedDocs.indexOf(id);

    if (evt.checked) {
      if (index === -1) {
        this.selectedDocs.push(id);
      }
    } else {
      if (index > -1) {
        this.selectedDocs.splice(index, 1);
      }
    }
  }

  /*** Select Link to Send ***/
  selectLink(evt: any, id: number): void {
    const index = this.selectedLinks.indexOf(id);

    if (evt.checked) {
      if (index === -1) {
        this.selectedLinks.push(id);
      }
    } else {
      if (index > -1) {
        this.selectedLinks.splice(index, 1);
      }
    }
  }

  /*** Select All Documents And Links ***/
  selectAll(evt: any, tabIndex: number, fieldIndex: number): void {
    for (const i in this.documentsData[tabIndex].Fields[fieldIndex].Questions) {
      if (this.documentsData[tabIndex].Fields[fieldIndex].Questions[i]) {
        if (this.documentsData[tabIndex].Fields[fieldIndex].Questions[i].Documents.length) {
          this.documentsData[tabIndex].Fields[fieldIndex].Questions[i].Documents.forEach((doc: any) => {
            this.selectDocument(evt, doc.Id);
          });
        }
        if (this.documentsData[tabIndex].Fields[fieldIndex].Questions[i].Links.length) {

          this.documentsData[tabIndex].Fields[fieldIndex].Questions[i].Links.forEach((link: any) => {
            this.selectLink(evt, link.Id);
          });
        }
      }
    }
  }

  /*** Send Selected Documents And Links ***/
  submitDocumets(): void {
    if (this.selectedDocs.length || this.selectedLinks.length) {
      this.sendDocuments.emit({ fileList: this.selectedDocs, linkList: this.selectedLinks });
    }
  }

}
