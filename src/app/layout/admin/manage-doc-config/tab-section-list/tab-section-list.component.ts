import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { User } from 'src/app/shared/models/user.model';
import swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tab-section-list',
  templateUrl: './tab-section-list.component.html',
  styleUrls: ['./tab-section-list.component.scss']
})
export class TabSectionListComponent implements OnInit {
  status = false;
  isLoading = false;
  displayedColumns: string[] = ['name','parent', 'type','actions'];
  dataSource: Array<any> = [];
  searchDealer = '';
  isFullListDisplayed = false;
  pageNumber = 0;
  pageSize = 20;
  searchterm = new Subject<string>();
  dataResult = {
    "statusCode": 200,
    "message": "Record fetched successfully",
    "result": [ 
      {
        "id": 16,
        "name": "Administration",
        "parent": "-",
        "type": "Tab",  
      },
      {
        "id": 11,
        "name": "Exterior",
        "parent": "-",
        "type": "Tab",  
      },
      {
        "id": 12,
        "name": "Vehicle Exterior Features and Functions",
        "parent": "Exterior",
        "type": "Section", 
      },
      {
        "id": 13,
        "name": "Front Trunk",
        "parent": "Vehicle Exterior Features and Functions",
        "type": "Sub Section",  
      },
      {
        "id": 14,
        "name": "Vehicle Interior Features and Functions",
        "parent": "Interior",
        "type": "Section",  
      },
      {
        "id": 15,
        "name": "Changing Driving Modes",
        "parent": "Vehicle Interior Features and Functions",
        "type": "Sub Section",  
      }
    ]
  }
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent): void {
    swal.close();
  }

  constructor(
    private router: Router,
    private http: HttpService,
    private message: MessageService,

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
        this.pageNumber = 0;
        this.pageSize = 20;
        this.isFullListDisplayed = false;
        this.getAllCenters();
      });
  }

  ngOnInit(): void {
    this.getAllCenters();
  }


  /*** Get Centers Listing ***/
  getAllCenters(): void {
    this.isLoading = true;
    const params = {
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      Search: this.searchDealer
    };
    this.http.getData(ApiUrl.admin.center, params).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result =  this.dataResult.result ? this.dataResult.result : []; 
        result.forEach((ele: any) => {
          ele.actions = '';
        });
        this.dataSource = [...this.dataSource, ...result];
      }
    });
  }

  /*** On Search ***/
  clickEvent(): void {
    
    this.status = !this.status;
    this.searchDealer = this.status ? this.searchDealer : '';
    if (!this.searchDealer) {
      this.applyFilter();
    }
  }

  /*** Get Staff Details ***/
  tabDetails(id: number): void {
    this.router.navigate(['/admin/manage-config/edit-section-tab', id]);
  }

  /*** Edit Dealer ***/
  editTab(id: number): void {
    this.router.navigate(['/admin/manage-config/edit-section-tab', id]);
  }

  /*** Remove Dealer ***/
  removeCenter(id: number): void {
    this.isLoading = true;
    this.http.deleteData(ApiUrl.admin.center, id.toString()).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        this.message.toast('success', response.message);
        this.getAllCenters();
      }
    });
  }

  /*** Confirm Delete ***/
  confirmDelete(id: number): void {
    this.message.confirm('inactivate this centre').then(data => {
      if (data.value) {
        this.removeCenter(id);
      }
    });
  }

  /*** On Search ***/
  applyFilter(): void {
    this.searchterm.next(this.searchDealer);
  }

  /*** On Scroll load data ***/
  onScroll(): void {
    if ((this.pageNumber * this.pageSize) <= this.dataSource.length) {
      this.pageNumber++;
      this.getAllCenters();
    } else {
      this.isFullListDisplayed = true;
    }
  }
}

