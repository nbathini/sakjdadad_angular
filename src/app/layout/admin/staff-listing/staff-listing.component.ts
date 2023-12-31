import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { User } from 'src/app/shared/models/user.model';
import swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
@Component({
  selector: 'app-staff-listing',
  templateUrl: './staff-listing.component.html',
  styleUrls: ['./staff-listing.component.scss']
})
export class StaffListingComponent implements OnInit {
  status = false;
  isLoading = false;
  displayedColumns: string[] = ['name', 'designation', 'contactNumber', 'email'];
  dataSource: Array<User> = [];
  dealerId: any;
  dealerData: User | undefined;;
  allStaffData: Array<User> = []; 
  searchStaff = '';
  isFullListDisplayed = false;
  pageNumber = 1;
  pageSize = 20;
  searchterm = new Subject<string>();
  rolePermissions: any;

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent): void {
    swal.close();
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private message: MessageService,
    private user : UserService
  ) { }

  ngOnInit(): void {
    this.dealerId = this.route.snapshot.paramMap.get('dealerId');
    this.getAllStaff();
    this.getDealerDetails();
    this.rolePermissions = this.user.getRoleGroup();
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
        this.getAllStaff();
      });
      this.rolePermissions = this.user.getRoleGroup();
      if(this.rolePermissions?.isEdit || this.rolePermissions?.isDelete){
        this.displayedColumns= ['name', 'designation', 'contactNumber', 'email', 'actions'];
      }
  }

  /*** Get Centers Listing ***/
  getAllStaff(): void {
    this.isLoading = true;
    const params = {
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      Search: this.searchStaff
    };
    const url = ApiUrl.admin.center + '/' + this.dealerId + '/Staff';
    this.http.getData(url, params,true).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result = response.result ? response.result : [];
        result.forEach((ele: any) => {
          ele.actions = '';
        });
        this.dataSource = result;
        this.allStaffData = result;
      }
    });
  }

  /*** On Search ***/
  clickEvent(): void {
    this.status = !this.status;
    this.searchStaff = this.status ? this.searchStaff : '';
    if (!this.searchStaff) {
      this.applyFilter();
    }
  }

  /*** Get Dealer Details ***/
  getDealerDetails(): void {
    const url = ApiUrl.admin.center + '/' + this.dealerId;
    this.http.getData(url).subscribe((response) => {
      if (!!response) {
        const result = response.result ? response.result : null;
        this.dealerData = result;
      }
    });
  }

  /*** Edit Dealer ***/
  editDealer(id: number): void {
    this.router.navigate(['admin/edit-dealer', id, 1]);
  }

  /*** Edit Dealer ***/
  editStaff(id: number): void {
    this.router.navigate(['admin/edit-staff', this.dealerId, id]);
  }

  /*** Confirm Delete ***/
  confirmDelete(id: number): void {
    this.message.confirm('inactivate this member').then(data => {
      if (data.value) {
        this.removeStaff(id);
      }
    });
  }

  /*** Remove Dealer ***/
  removeStaff(id: number): void {
    const url = ApiUrl.admin.center + '/' + this.dealerId + '/Staff';
    this.http.deleteData(url, id.toString()).subscribe((response) => {
      if (!!response) {
        this.message.toast('success', response.message);
        this.getAllStaff();
      }
    });
  }

  /*** On Search ***/
  applyFilter(): void {
    this.searchterm.next(this.searchStaff);
  }

  /*** On Scroll load data ***/
  onScroll(): void {
    if ((this.pageNumber * this.pageSize) <= this.dataSource.length) {
      this.pageNumber++;
      this.getAllStaff();
    } else {
      this.isFullListDisplayed = true;
    }
  }
}
