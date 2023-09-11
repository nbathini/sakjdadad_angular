import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { Patterns } from 'src/app/shared/models/patterns.model';

@Component({
  selector: 'app-add-tab-section',
  templateUrl: './add-tab-section.component.html',
  styleUrls: ['./add-tab-section.component.scss']
})
export class AddTabSectionComponent implements OnInit {
  roleId: any; 
  roleForm = new FormGroup({});
  isSubmitted = false;
  isLoading = false;
  validationPattern = new Patterns();
  dealerId:any;
  subSectionsArray: Array<any> = [
    {
      "id": 1,
      "name": "Section"
    },
    {
      "id": 2,
      "name": "Sub Section"
    },
    {
      "id": 3,
      "name": "Tab"
    }
  ];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private http: HttpService
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
      type: ['', [Validators.required]],
      parent: [''],
      name: ['', [Validators.required]],
      descriptiion: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern(this.validationPattern.telPattern)]],
    });
  }

  /*** Get Dealer Details ***/
  getRoleDetails(): void {
    this.isLoading = true;
    const url = ApiUrl.admin.center + '/' + this.roleId;
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

    this.roleForm.controls.name.patchValue(data.name);
    this.roleForm.controls.email.patchValue(data.email);
    this.roleForm.controls.contactNumber.patchValue(data.contactNumber);
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
    if (this.roleId) {
      params.id = +(this.roleId);
      this.http.putData(ApiUrl.admin.center, params).subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.message.toast('success', response.message);
          if (this.roleId) {
            this.router.navigate(['admin/all-staff', this.roleId]);
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
    if (this.roleId) {
      this.router.navigate(['/admin/manage-config/section-tab-list', this.roleId]);
    } else {
      this.router.navigate(['/admin/manage-config/section-tab-list']);
    }
  }



}
