import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { UserService } from 'src/app/services/user/user.service';
import { Patterns } from 'src/app/shared/models/patterns.model';

@Component({
  selector: 'app-view-car-model',
  templateUrl: './view-car-model.component.html',
  styleUrls: ['./view-car-model.component.scss']
})
export class ViewCarModelComponent implements OnInit {
  modelId: any;
  roleForm = new FormGroup({});
  isSubmitted = false;
  isLoading = false;
  validationPattern = new Patterns();
  dealerId: any;
  editResult: any;
  rolePermissions: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private http: HttpService,
    private user : UserService
  ) {
    this.createRoleForm();
  }
  ngOnInit(): void {
    this.modelId = this.route.snapshot.paramMap.get('id');
    if (this.modelId) { this.getRoleDetails(); }
    this.rolePermissions = this.user.getRoleGroup();
  }

  /*** Intialize Dealer Form ***/
  createRoleForm(): void {
    this.roleForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
    });
  }
  editTab(id: number): void {
    this.router.navigate(['/admin/master/car-model/edit', id]);
  }
  /*** Get Dealer Details ***/
  getRoleDetails(): void {
    this.isLoading = true;
    const url = ApiUrl.admin.masterData.carmodel + '/' + this.modelId;
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

  /*** Set Default Values ***/
  setFormData(data: any): void {

    this.roleForm.controls.name.patchValue(data.name);
    //   this.roleForm.controls.imageUrl.patchValue(data.imageUrl);
    this.roleForm.controls.description.patchValue(data.description);
  }

  /*** Trim form values ***/
  trim(key: string): void {
    this.roleForm.controls[key].patchValue(this.roleForm.controls[key].value.trim());
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
    const params = { ...this.roleForm.value };
    this.isLoading = true;
    if (this.modelId) {
      params.id = +(this.modelId);
      this.http.putData(ApiUrl.admin.center, params).subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.message.toast('success', response.message);
          if (this.modelId) {
            this.router.navigate(['admin/all-staff', this.modelId]);
          } else {
            this.router.navigate(['admin/all-dealers']);
          }
        }
      }, (err) => {
        this.isLoading = false;
      });
    } else {
      this.http.postData(ApiUrl.admin.center, params).subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.message.toast('success', response.message);
          this.router.navigate(['admin/all-dealers']);
        }
      }, (err) => {
        this.isLoading = false;
      });
    }
  }

  /*** Navigate Back to Listing***/
  backToListing(): void {
    this.router.navigate(['admin/master/car-model']);
  }



}
