import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-doc-view-popup',
  templateUrl: './doc-view-popup.component.html',
  styleUrls: ['./doc-view-popup.component.scss']
})
export class DocViewPopupComponent implements OnInit {
  filePath = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.document && this.data.document.FileSubPath) {
      this.filePath = environment.BASE_DOC_URL + this.data.document.FileSubPath + '/' + this.data.document.FileName;
    }
  }

}
