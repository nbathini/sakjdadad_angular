import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { User } from 'src/app/shared/models/user.model';
import swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-car-model',
  templateUrl: './car-model.component.html',
  styleUrls: ['./car-model.component.scss']
})
export class CarModelComponent implements OnInit {
  status = false;
  isLoading = false;
  displayedColumns: string[] = ['name', 'imagePath', 'description'];
  dataSource: Array<any> = [];
  searchModel = '';
  isFullListDisplayed = false;
  pageNumber = 1;
  pageSize = 20;
  searchterm = new Subject<string>();
  tableLoad = true;
  fromDelete = false;
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
    private sanitizer: DomSanitizer,
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
        this.getAllCenters();
      });
  }

  ngOnInit(): void {
    this.getAllCenters();
    this.rolePermissions = this.user.getRoleGroup();
    if (this.rolePermissions?.isEdit || this.rolePermissions?.isDelete) {
      this.displayedColumns = ['name', 'imagePath', 'description', 'actions'];
    }
  }

  sanitizeImageUrl(imageUrl: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
  }
  dataTableReload() {
    this.tableLoad = false;
    setTimeout(() => {
      this.tableLoad = true;
    }, 100)
  }
  /*** Get Centers Listing ***/
  getAllCenters(param?: any): void {
    this.isLoading = true;
    const params = {
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      Search: this.searchModel
    };
    this.http.getData(ApiUrl.admin.masterData.carmodel, params,true).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result = response ? response.result : [];
        if (result.length < this.pageSize) this.loadCompleted = true;
        result.forEach((ele: any) => {
          ele.actions = '';
        });
        if (param) {

        }
        if (this.fromDelete) {
          this.dataSource = [...result];
          this.fromDelete = false;
          this.dataTableReload();
        } else {
          this.dataSource = [...this.dataSource, ...result];
        }
        if (this.dataSource.length === 0)
           this.toastr.error("No results matching the search criteria!");
          

      }
    });
  }
  /*** On Search ***/
  clickEvent(): void {
    this.loadCompleted = false;
    this.status = !this.status;
    this.searchModel = this.status ? this.searchModel : '';
    if (!this.searchModel) {
      this.applyFilter();
    }
  }

  /*** Get Staff Details ***/
  tabDetails(id: number): void {
    this.router.navigate(['/admin/master/car-model/view', id]);
  }

  /*** Edit Dealer ***/
  editTab(id: number): void {
    this.router.navigate(['/admin/master/car-model/edit', id]);
  }

  /*** Remove Dealer ***/
  removeCenter(id: number): void {
    this.http.deleteData(ApiUrl.admin.masterData.carmodel, id.toString()).subscribe((response) => {
      if (!!response) {
        this.message.toast('success', response.message);
        this.getAllCenters();
        this.fromDelete = true;
      }
    });
  }

  /*** Confirm Delete ***/
  confirmDelete(id: number): void {
    this.message.confirm('inactivate this model').then(data => {
      if (data.value) {
        this.removeCenter(id);
      }
    });
  }

  confirmActivate(id: number, isActive: any): void { 
    this.message.confirm(isActive?'activate this car model':'inactivate this car model').then(data => {
      if (data.value) {
        this.activateCarModel(id, isActive);
      }
    });
  }
  activateCarModel(id: number, isActive: any): void {
    this.http.deleteRecord(ApiUrl.admin.masterData.carmodel + '/' + id + '/' + isActive).subscribe((response) => {
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
    this.searchterm.next(this.searchModel);
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

