import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { AddLinkModalComponent } from '../add-link-modal/add-link-modal.component';

@Component({
  selector: 'app-manage-documents',
  templateUrl: './manage-documents.component.html',
  styleUrls: ['./manage-documents.component.scss']
})
export class ManageDocumentsComponent implements OnInit {

  docJson: any;
  tabs = [];
  documents: Array<any> = [];
  selectedTab = 0;
  selectedPath = '';
  fileType = ['text/plain', 'application/pdf', 'application/vnd.ms-word', 'application/vnd.ms-word', 'application/vnd.ms-excel', 'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet', 'image/png', 'image/jpeg', 'image/jpeg', 'image/gif', 'text/csv', 'video/mp4', '.png', '.jpg', '.gif', '.csv', '.mp4', '.jpeg', '.xlsx', '.xls', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.pdf'];
  @ViewChild("file", {static: false}) file: ElementRef;
  constructor(
    private dialog: MatDialog,
    private message: MessageService,
    private http: HttpService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.getDocuments();
  }

  /*** Get CheckList Documents ***/
  getDocuments(): void {
    this.http.getData(ApiUrl.admin.getDocuments).subscribe((response) => {
      if (!!response) {
        this.docJson = response.result ? JSON.parse(response.result) : [];
      }
    });
  }

  /***Add Link ***/
  addLink(question: string, field: string, tab: string): void {
    const dialogRef = this.dialog.open(AddLinkModalComponent, { panelClass: 'add-link-popup' });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (!!result && result.url) {
        const param = {
          link: result.url,
          path: tab + '/' + field + '/' + question
        };
        this.http.postData(ApiUrl.admin.externalLink, param).subscribe((resp) => {
          if (!!resp) {
            this.getDocuments();
            this.message.toast('success', resp.message);
          }
        });
      }
    });
  }

  /********** On selection of file insert the value in documents array **********/
  onFileSelect(event: any): void {
    this.documents = [];

    if (event.target.files && event.target.files[0]) {
      for (const file of event.target.files) {
        const extension = file.name.split('.').pop().toLowerCase();
        // if (file.size / 1024 / 1024 < 5) {
        if (this.fileType.indexOf(extension)) {
          this.documents.push(file);
        } else {
          this.message.toast('error', 'Invalid File Type');
          this.file.nativeElement.value = "";
          return;
        }
        // } else this.message.toast('warning', 'File Size Should Be Less Than 5 Mb');
      }
      this.uploadDocuments();
    }
  }

  /*** SetPath for documents to upload***/
  setPath(question: string, field: string, tab: string): void {
    this.selectedPath = '?subPath=' + tab + '/' + field + '/' + question;
  }

  /*** Upload Documents to Checklist ***/
  uploadDocuments(): void {
    const fileData = new FormData();
    this.documents.forEach(file => {
      fileData.append('files', file);
    });
    this.http.postData(ApiUrl.admin.documents + this.selectedPath, fileData).subscribe((resp) => {
      if (!!resp) {
        this.documents = [];
        this.getDocuments();
        this.message.toast('success', resp.message);
      }
    },(errr)=>{
      this.file.nativeElement.value = "";
    });
  }

  /*** Rremove Link from Checklist***/
  removeLink(id: number): void {
    this.message.confirm('remove this link').then(data => {
      if (data.value) {
        this.http.deleteData(ApiUrl.admin.externalLink, id.toString()).subscribe((response) => {
          if (!!response) {
            this.message.toast('success', response.message);
            this.getDocuments();
          }
        });
      }
    });
  }

  /*** Remove Document from Checklist***/
  removeDocument(id: number): void {
    this.message.confirm('remove this file').then(data => {
      if (data.value) {
        this.http.deleteData(ApiUrl.admin.documents, id.toString()).subscribe((response) => {
          if (!!response) {
            this.message.toast('success', response.message);
            this.getDocuments();
          }
        });
      }
    });
  }
  editConfig(){
    this.router.navigate(['/admin/manage-config'], { queryParams: {edit:true} });
  }
}
