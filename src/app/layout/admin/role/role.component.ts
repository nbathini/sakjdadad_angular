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
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  status = false;
  isLoading = false;
  displayedColumns: string[] = ['roleName', 'roleDescription', 'modules', 'isActive'];
  dataSource: Array<any> = [];
  searchDealer = '';
  isFullListDisplayed = false;
  pageNumber = 1;
  pageSize = 20;
  searchterm = new Subject<string>();
  fromDelete = false;
  tableLoad = true;
  loadCompleted = false;
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
    private user: UserService
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
        this.getAllRoles();
      });
  }

  ngOnInit(): void {
    this.getAllRoles();
    this.rolePermissions = this.user.getRoleGroup();
    if (this.rolePermissions?.isEdit || this.rolePermissions?.isDelete) {
      this.displayedColumns = ['roleName', 'roleDescription', 'modules', 'isActive', 'actions'];
    }
  }


  /*** Get Roles Listing ***/
  getAllRoles(): void {
    this.isLoading = true;
    const params = {
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      Search: this.searchDealer
    };
    this.http.getData(ApiUrl.admin.role, params,true).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        let result = response.result ? response.result : [];
        if (result.length < this.pageSize) this.loadCompleted = true;
        //  result = result.filter((item:any) => item.isActive === true);
        result.forEach((ele: any) => {
          ele.actions = '';
        });
        if (this.fromDelete) {
          this.dataSource = [...result];
          this.fromDelete = false;
        } else {
          this.dataSource = [...this.dataSource, ...result];
        }
        if (this.dataSource.length === 0)
          this.toastr.error("No results matching the search criteria!");
        this.dataTableReload();
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

  /*** Get Staff Details ***/
  roleDetails(id: number): void {
    this.router.navigate(['/admin/roles/view-role', id]);
  }

  /*** Edit Dealer ***/
  editCentre(id: number): void {
    this.router.navigate(['/admin/roles/edit-role', id]);
  }

  /*** Remove Dealer ***/
  removeRole(id: number): void {
    this.http.putData(ApiUrl.admin.role + '/Delete?roleId=' + id + '&isActive=false', {}).subscribe((response) => {
      if (!!response) {
        this.message.toast('success', response.message);
        this.fromDelete = true;
        this.getAllRoles();
      }
    });
  }
  /*** Confirm Activate ***/
  confirmActivate(id: number, isActive: any): void {
    this.message.confirm(isActive ? 'activate this role' : 'inactivate this role').then(data => {
      if (data.value) {
        this.activateRole(id, isActive);
      }
    });
  }
  activateRole(id: number, isActive: any): void {
    this.http.deleteRecord(ApiUrl.admin.role + '/' + id + '/' + isActive).subscribe((response) => {
      if (!!response) {
        this.message.toast('success', response.message);
        this.fromDelete = true;
        this.dataSource = [...[]];
        this.getAllRoles();
      }
    });
  }
  /*** Confirm Delete ***/
  confirmDelete(id: number): void {
    this.message.confirm('inactivate this role').then(data => {
      if (data.value) {
        this.removeRole(id);
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
      this.getAllRoles();
    } else {
      this.isFullListDisplayed = true;
    }
  }
}

