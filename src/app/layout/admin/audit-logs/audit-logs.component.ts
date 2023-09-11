import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { User } from 'src/app/shared/models/user.model';
import swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { appConfig } from 'src/app/core/app-conf';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit {
  appConfig = appConfig;
  status = false;
  isLoading = false;
  displayedColumns: string[] = ['id', 'eventName', 'activityDate', 'activityTime', 'performedBy', 'centreName', 'moduleName'];
  dataSource: Array<any> = [];
  searchDealer = '';
  isFullListDisplayed = false;
  pageNumber = 1;
  pageSize = 20;
  searchterm = new Subject<string>();
  loadCompleted = false;
  tableLoad = true;
  fromDelete = false;
  loadingText = false;
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent): void {
    swal.close();
  }

  constructor(
    private router: Router,
    private http: HttpService,
    private message: MessageService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private loader: LoaderService
  ) {
    this.searchterm.pipe(
      // Time in milliseconds between key events
      debounceTime(500)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    )
      .subscribe(term => {
        this.dataSource = [];
        this.pageNumber = 1;
        this.pageSize = 20;
        this.isFullListDisplayed = false;
        this.getAllCenters();
      });
  }

  ngOnInit(): void {
    this.getAllCenters();
  }

  dateConvert(inputDate: any) {
    return this.datePipe.transform(inputDate, 'dd-MMM-yy');
  }
  /*** Get Centers Listing ***/
  getAllCenters(): void {

    this.isLoading = true;
    const params = {
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      Search: this.searchDealer
    };
    this.http.getData(ApiUrl.admin.audit, params, true).subscribe((response) => {
      if (!!response) {
        const result = response.result ? response.result : [];
        console.log("result", result)
        if (result.length < this.pageSize) this.loadCompleted = true;
        result.forEach((ele: any) => {
          ele.actions = '';
        });
        console.log("result", this.dataSource);
        this.dataSource = [...this.dataSource, ...result];
        this.isLoading = false;
        console.log("result after", this.dataSource, this.isLoading);
        if (this.dataSource.length === 0)
          this.toastr.error("No results matching the search criteria!");
        //  this.dataTableReload();
      }
    });
  }
  dataTableReload() {
    this.tableLoad = false;
    setTimeout(() => {
      this.tableLoad = true;
    }, 100)
  }
  /*** On Search ***/
  clickEvent(): void {
    this.loadCompleted = false;
    this.status = !this.status;
    this.searchDealer = this.status ? this.searchDealer : '';
    if (!this.searchDealer) {
      this.applyFilter();
    }
  }




  /*** On Search ***/
  applyFilter(): void {
    this.searchterm.next(this.searchDealer);
  }

  /*** On Scroll load data ***/
  onScroll(): void {
    console.log("fff", ((this.pageNumber * this.pageSize) <= this.dataSource.length) && !this.loadCompleted, this.pageNumber * this.pageSize, this.dataSource.length, this.loadCompleted, this.isLoading)
    if (!this.isLoading) {
      if (((this.pageNumber * this.pageSize) <= this.dataSource.length) && !this.loadCompleted) {
        this.pageNumber++;
        this.getAllCenters();
      } else {
        this.isFullListDisplayed = true;
      }
    }
  }
  exportDataToExcel(): void {
    this.exportToExcel(this.dataSource, 'user_data');
  }
  exportDataFromUrlToExcel() {
    this.http.getData(ApiUrl.admin.auditAll).subscribe((response: any) => {
      if (!!response) {
        const result = response.result ? response.result : [];
        const formattedDate = this.datePipe.transform(new Date(), 'ddMMMyy');
        this.exportToExcel(result, 'PCL Log' + formattedDate);
        if (result.length === 0)
          this.toastr.error("No results found");
        //  this.dataTableReload();
      }

    });
  }
  exportToExcel(data: any[], filename: string): void {
    console.log("data", data);
    const header = [
      { name: 'ID', key: 'id', width: 10 },
      { name: 'Event Name', key: 'eventName', width: 40 },
      { name: 'Activity Date', key: 'activityDate', width: 20, dataType: 'Date' },
      { name: 'Activity Time', key: 'activityTime', width: 20 },
      { name: 'Performed By', key: 'performedBy', width: 20 },
      { name: 'Centre Name', key: 'centreName', width: 20 },
      { name: 'Module Name', key: 'moduleName', width: 20 }
    ];
    const headerNames = header.map(column => column.name);
    const headerKeys = header.map(column => column.key);

    const formattedData = data.map(item => {
      const formattedItem: any = {};

      headerKeys.forEach((key, index) => {
        if (header[index].dataType === 'Date') {
          formattedItem[headerNames[index]] = this.datePipe.transform(item[key], 'dd-MMM-yy');
        } else {
          formattedItem[headerNames[index]] = item[key];
        }
      });

      return formattedItem;
    });
    console.log("formattedData", formattedData);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData, { skipHeader: false });

    headerNames.forEach((headerName, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      ws[cellAddress] = { v: headerName, t: 's' };
      if (header[index].width) {
        if (!ws['!cols']) {
          ws['!cols'] = [];
        }
        ws['!cols'][index] = { width: header[index].width };
      }
    });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename + '.xlsx');
  }
  formatDateOrTime(value: any): any {
    if (value instanceof Date) {
      return this.datePipe.transform(value, 'dd-MMM-yy');
    }
    return value;
  }
  /*  generatePdfFromUrl() {
    const params = {
      PageNumber: 0,
      PageSize: 100000000,
      Search: this.searchDealer
    };
    this.http.getData(ApiUrl.admin.audit, params).subscribe((response: any) => {
      if (!!response) {
        const result = response.result ? response.result : []; 
        this.generatePdf(result, 'exported_data');
        if (result.length === 0)
          this.toastr.error("No results found");
        //  this.dataTableReload();
      }

    }); 
  }

  generatePdf(data: any[],filename: string): void {
    const header = [
      { name: 'ID', key: 'id', width: 10 },
      { name: 'Event Name', key: 'eventName', width: 40 },
      { name: 'Activity Date', key: 'activityDate', width: 20, dataType: 'Date' },
      { name: 'Activity Time', key: 'activityTime', width: 20 },
      { name: 'Performed By', key: 'performedBy', width: 20 },
      { name: 'Centre Name', key: 'centreName', width: 20 },
      { name: 'Module Name', key: 'moduleName', width: 20 }
    ];
    const doc = new jsPDF(); 
    const headerNames = header.map(column => column.name);
    const headerKeys = header.map(column => column.key);

    const formattedData = data.map(item =>
      headerKeys.map(key => (item[key] instanceof Date ? this.formatDate(item[key]) : item[key]))
    );

    doc.autoTable({
      head: [headerNames],
      body: formattedData,
    });

    doc.save(filename + '.pdf');
  }   */

  formatDate(date: Date): string {
    // Implement your date formatting logic here
    return '';
  }
}
