import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { Patterns } from 'src/app/shared/models/patterns.model';
import { Designation, User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent implements OnInit {

  dealerId: any;
  staffId: any;

  staffForm = new FormGroup({});
  isSubmitted = false;
  isLoading = false;
  designations: Array<Designation> = [];
  dealerData: User;
  staffData: User;
  validationPattern = new Patterns();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private http: HttpService
  ) {
    this.createStaffForm();
  }

  ngOnInit(): void {
    this.dealerId = this.route.snapshot.paramMap.get('dealerId');
    this.staffId = this.route.snapshot.paramMap.get('id'); 
    this.getDealerDetails();
    this.getDesignations();
    if (this.staffId) { this.getStaffDetails(); }
    this.staffForm.controls.dealerId.patchValue(+(this.dealerId), { onlySelf: true });
  }

  /*** Intialize Dealer Form ***/
  createStaffForm(): void {
    this.staffForm = this.formBuilder.group({
      dealerId: 0,
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.validationPattern.emailPattern)]],
      designation: ['', [Validators.required]],
      contactNumber: ['', [Validators.pattern(this.validationPattern.telPattern)]],
    });
  }

  /*** Get Designation Listing ***/
  getDesignations(): void {
    this.http.getData(ApiUrl.admin.designation).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result = response.result ? response.result : null;
        if (result) { this.designations = result; }
      }
    });
  }

  /*** Get Dealer Details ***/
  getDealerDetails(): void {
    this.isLoading = true;
    const url = ApiUrl.admin.center + '/' + this.dealerId;
    this.http.getData(url).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result = response.result ? response.result : null;
        this.dealerData = result;
      }
    });
  }

  /*** Get Dealer Details ***/
  getStaffDetails(): void {
    const url = ApiUrl.admin.center + '/' + this.dealerId + '/Staff' + '/' + this.staffId;

    this.isLoading = true;
    this.http.getData(url).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result = response.result ? response.result : null;
        if (result) {
          this.setFormData(result);
        } else {
          this.message.toast('error', response.message);
          this.router.navigate(['admin/all-staff', this.dealerId]);
        }
      }
    }, (err) => {
      this.router.navigate(['admin/all-staff', this.dealerId]);
    });
  }

  /*** Set Default Values ***/
  setFormData(data: any): void {
    this.staffData = data;
    this.staffForm.controls.name.patchValue(data.name, { onlySelf: true });
    this.staffForm.controls.email.patchValue(data.email, { onlySelf: true });
    this.staffForm.controls.contactNumber.patchValue(data.contactNumber, { onlySelf: true });
    this.staffForm.controls.designation.patchValue(data.designation, { onlySelf: true });
  }

  /*** Trim form values ***/
  trim(key: string): void {
    this.staffForm.controls[key].patchValue(this.staffForm.controls[key].value.trim());
  }

  /*** Submit Login Form ***/
  onSubmit(): void {
    const url = ApiUrl.admin.center + '/' + this.dealerId + '/Staff';

    this.isSubmitted = true;
    if (!this.staffForm.valid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 10000);
      return;
    }
    const params = { ...this.staffForm.value };
    this.isLoading = true;
    if (this.staffId) {
      params.id = +(this.staffId);
      this.http.putData(url, params).subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.message.toast('success', response.message);
          this.router.navigate(['admin/all-staff', this.dealerId]);
        }
      }, (err) => {
        this.isLoading = false;
      });
    } else {
      this.http.postData(url, params).subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.message.toast('success', response.message);
          this.router.navigate(['admin/all-staff', this.dealerId]);
        }
      }, (err) => {
        this.isLoading = false;
      });
    }
  }

  /*** Navigate Back to Listing***/
  backToListing(): void {
    this.router.navigate(['admin/all-staff', this.dealerId]);
  }

}
