import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { UserService } from 'src/app/services/user/user.service';
import { Patterns } from 'src/app/shared/models/patterns.model';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.scss']
})
export class ViewRoleComponent implements OnInit {
  roleId: any;
  roleForm = new FormGroup({});
  isSubmitted = false;
  isLoading = false;
  validationPattern = new Patterns();
  dealerId: any;
  editResult :any;
  rolePermissions: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private http: HttpService,
    private user : UserService
  ) { 
  }
  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id');
    if (this.roleId) { this.getRoleDetails(); }
    this.rolePermissions = this.user.getRoleGroup();
  }

 

  /*** Get Dealer Details ***/
  getRoleDetails(): void {
    this.isLoading = true;
    const url = ApiUrl.admin.role + '/' + this.roleId; 
    this.http.getData(url).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result = response.result ? response.result : null;
        if (result) {
          this.editResult = result;
        } else {
          this.message.toast('error', response.message);
          this.router.navigate(['/admin']);
        }
      }
    }, (err) => {
      this.router.navigate(['/admin']);
    });
  }
  editTab(id: number): void {
    this.router.navigate(['/admin/roles/edit-role', id]);
  }
 
 
  /*** Navigate Back to Listing***/
  backToListing(): void { 
      this.router.navigate(['/admin/roles']); 
  }



}
