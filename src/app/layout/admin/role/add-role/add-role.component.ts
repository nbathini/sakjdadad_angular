import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { Patterns } from 'src/app/shared/models/patterns.model';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  roleId: any;
  roleForm = new FormGroup({});
  isSubmitted = false;
  isLoading = false;
  validationPattern = new Patterns();
  dealerId: any;
  editResult = {
    "statusCode": 200,
    "message": "Record fetched successfully",
    "result": {
      "id": 16,
      "roleName": "Sales Manager",
      "roleDescription": "Sales Manager",
      "isActive": true,
      "staff": 0,
      "password": null
    }
  };
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private http: HttpService,
    private toastr: ToastrService
  ) {
    this.createRoleForm();
  }
  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id');
    if (this.roleId) { this.getRoleDetails(); }
  }

  /*** Intialize Dealer Form ***/
  createRoleForm(): void {
    this.roleForm = this.formBuilder.group({
      id: [0],
      roleName: ['', [Validators.required]],
      roleDescription: [''],
      modules: this.formBuilder.group({
        id: ['', [Validators.required]]
      }),
      isCreate: [false],
      isEdit: [false],
      isView: [true],
      isDelete: [false],
      isActive: [true],
    });
  }

  /*** Get Dealer Details ***/
  getRoleDetails(): void {
    this.isLoading = true;
    const url = ApiUrl.admin.role + '/' + this.roleId;
    this.setFormData(this.editResult.result);
    this.http.getData(url).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result = response.result ? response.result : null;
        if (result) {
          this.setFormData(result);
        } else {
          this.message.toast('error', response.message);
          this.router.navigate(['/admin']);
        }
      }
    }, (err) => {
      this.router.navigate(['/admin']);
    });
  }

  /*** Set Default Values ***/
  setFormData(data: any): void {
    this.roleForm.patchValue(data);
    /* this.roleForm.controls.roleName.patchValue(data.roleName);
    this.roleForm.controls.roleDescription.patchValue(data.roleDescription);
    this.roleForm.controls.modules.patchValue(data.modules);
    this.roleForm.controls.isCreate.patchValue(data.isCreate);
    this.roleForm.controls.isEdit.patchValue(data.isEdit);
    this.roleForm.controls.isView.patchValue(data.isView);
    this.roleForm.controls.isDelete.patchValue(data.isDelete); */
  }

  /*** Trim form values ***/
  trim(key: string): void {
    this.roleForm.controls[key].patchValue(this.roleForm.controls[key].value.trim());
  }
  updateCheckBox(type: number, val: number) {
    if (type === 2) {
  //    this.roleForm.patchValue({ isView: false });
  //    if (this.roleForm.value.isCreate || this.roleForm.value.isEdit) this.roleForm.patchValue({ isView: true });
      if (this.roleForm.value.isDelete) this.roleForm.patchValue({ isEdit: true, isView: true });
    }
  }
  changeModule(type: number) {
    if (type === 2) {
      this.roleForm.patchValue({
        adminCreate: false,
        adminEdit: false,
        adminDelete: false,
        adminView: false
      });
    }
    if (type === 1) {
      this.roleForm.patchValue({
        dealerCreate: false,
        dealerEdit: false,
        dealerDelete: false,
        dealerView: false
      });
    }
  }
  /*** Submit Login Form ***/
  onSubmit(): void {
    this.isSubmitted = true;
    if (!this.roleForm.valid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 10000);
      return;
    }
    if (!this.roleForm.value.isView) return;
    const params = { ...this.roleForm.value };
    this.isLoading = true;
    if (this.roleId) {
      params.id = +(this.roleId);
      this.http.putData(ApiUrl.admin.role, params).subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.message.toast('success', response.message);
          this.router.navigate(['admin/roles']);
        }
      }, (err) => {
        this.isLoading = false;
      });
    } else {
      this.http.postData(ApiUrl.admin.role, params).subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.message.toast('success', response.message);
          this.router.navigate(['admin/roles']);
        }
      }, (err) => {
        this.isLoading = false;
      });
    }
  }

  /*** Navigate Back to Listing***/
  backToListing(): void {
    if (this.roleId) {
      this.router.navigate(['/admin/roles']);
    } else {
      this.router.navigate(['/admin/roles']);
    }
  }



}
