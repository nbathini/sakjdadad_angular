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
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-list-dealer',
  templateUrl: './list-dealer.component.html',
  styleUrls: ['./list-dealer.component.scss']
})

export class ListDealerComponent implements OnInit {
  status = false;
  isLoading = false;
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'staff'];
  dataSource: Array<User> = [];
  searchDealer = '';
  isFullListDisplayed = false;
  pageNumber = 1;
  pageSize = 20;
  searchterm = new Subject<string>();
  loadCompleted= false;
  tableLoad = true;
  fromDelete = false;
  rolePermissions: any;
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent): void {
    swal.close();
  }

  constructor(
    private router: Router,
    private http: HttpService,
    private message: MessageService,
    private toastr: ToastrService,
    private user : UserService
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
    this.rolePermissions = this.user.getRoleGroup();
    if(this.rolePermissions?.isEdit || this.rolePermissions?.isDelete){
      this.displayedColumns= ['name', 'email', 'contactNumber', 'staff', 'actions'];
    }
  }
  


  /*** Get Centers Listing ***/
  getAllCenters(): void {
    this.isLoading = true;
    const params = {
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      Search: this.searchDealer
    };
    this.http.getData(ApiUrl.admin.center, params,true).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result = response.result ? response.result : [];
        if (result.length < this.pageSize) this.loadCompleted = true;
        result.forEach((ele: any) => {
          ele.actions = '';
        });
        
        if (this.fromDelete) {
          this.dataSource = [...result];
          this.fromDelete = false;
          this.dataTableReload();
        } else {
          this.dataSource = [...this.dataSource, ...result];
        }
        if(this.dataSource.length === 0)
        this.toastr.error("No results matching the search criteria!");
        
      }
    });
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
  dataTableReload() {
    this.tableLoad = false;
    setTimeout(() => {
      this.tableLoad = true;
    }, 100)
  }
  /*** Get Staff Details ***/
  centreDetails(id: number): void {
    this.router.navigate(['admin/all-staff', id]);
  }

  /*** Edit Dealer ***/
  editCentre(id: number): void {
    this.router.navigate(['admin/edit-dealer', id]);
  }

  /*** Remove Dealer ***/
  removeCenter(id: number): void { 
    this.http.deleteRecord(ApiUrl.admin.center+'/'+id+'/false').subscribe((response) => { 
      if (!!response) {
        this.message.toast('success', response.message);
        this.getAllCenters();
        this.fromDelete = true;
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
  confirmActivate(id: number,isActive:any): void {
    this.message.confirm(isActive?'activate this centre':'inactivate this centre').then(data => {
      if (data.value) {
        this.activateCentre(id,isActive);
      }
    });
  }
  activateCentre(id: number,isActive:any): void { 
    this.http.deleteRecord(ApiUrl.admin.center+'/'+id+'/'+isActive).subscribe((response) => { 
      if (!!response) {
        this.message.toast('success', response.message);
        this.fromDelete = true;
        this.dataSource = [...[]];
        this.getAllCenters(); 
      }
    });
  }

  /*** On Search ***/
  applyFilter(): void {
    this.searchterm.next(this.searchDealer);
  }

  /*** On Scroll load data ***/
  onScroll(): void {
    if (((this.pageNumber * this.pageSize) <= this.dataSource.length) && !this.loadCompleted) {
      this.pageNumber++;
      this.getAllCenters();
    } else {
      this.isFullListDisplayed = true;
    }
  }
}
