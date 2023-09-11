import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { UtilsService } from 'src/app/core/utils.service';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { Patterns } from 'src/app/shared/models/patterns.model';

@Component({
  selector: 'app-add-dealer',
  templateUrl: './add-dealer.component.html',
  styleUrls: ['./add-dealer.component.scss']
})
export class AddDealerComponent implements OnInit {

  staffId: any;
  dealerId: any;
  dealerForm = new FormGroup({});
  isSubmitted = false;
  isLoading = false;
  validationPattern = new Patterns();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private http: HttpService,
    private UtilsService : UtilsService
  ) {
    this.createdealerForm();
  }
  ngOnInit(): void {
    this.staffId = this.route.snapshot.paramMap.get('staffId');
    this.dealerId = this.route.snapshot.paramMap.get('id');
    if (this.dealerId) { this.getDealerDetails(); }
    const inputElement = document.getElementById('phoneNumberInput') as HTMLInputElement; 
    inputElement.addEventListener('keydown', (event) => {
      // Allow key codes for digits and necessary control keys (e.g., backspace, delete, arrow keys)
      const allowedKeyCodes = [8, 9, 37, 39, 46]; // Backspace, Tab, Left Arrow, Right Arrow, Delete

      if (!allowedKeyCodes.includes(event.keyCode) && (event.key < '0' || event.key > '9')) {
        event.preventDefault();
      }
    });
  }

  /*** Intialize Dealer Form ***/
  createdealerForm(): void {
    this.dealerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.validationPattern.emailPattern)]],
      contactNumber: ['', [Validators.required, Validators.pattern(this.validationPattern.telPattern)]],
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

    this.dealerForm.controls.name.patchValue(data.name);
    this.dealerForm.controls.email.patchValue(data.email);
  //  this.dealerForm.controls.contactNumber.patchValue(data.contactNumber);
    this.dealerForm.controls.contactNumber.patchValue(data.contactNumber.includes('+1') ? + data.contactNumber.slice(2).replace(/\D/g, '') : data.contactNumber.replace(/\D/g, ''));
    this.formatPhoneNumber();
  }

  /*** Trim form values ***/
  trim(key: string): void {
    this.dealerForm.controls[key].patchValue(this.dealerForm.controls[key].value.trim());
  }

  /*** Submit Login Form ***/
  onSubmit(): void {
    this.isSubmitted = true;
    if (!this.dealerForm.valid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 10000);
      return;
    }
    const params = { ...this.dealerForm.value };
    params.contactNumber = params.contactNumber.toString(); 
    params.contactNumber = !params.contactNumber.includes('+1') ? '+1 ' + params.contactNumber : params.contactNumber;
    this.isLoading = true;
    if (this.dealerId) {
      params.id = +(this.dealerId);
      this.http.putData(ApiUrl.admin.center, params).subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.message.toast('success', response.message);
          if (this.staffId) {
            this.router.navigate(['admin/all-staff', this.dealerId]);
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
    if (this.staffId) {
      this.router.navigate(['admin/all-staff', this.dealerId]);
    } else {
      this.router.navigate(['admin/all-dealers']);
    }
  }
  formatPhoneNumber() {
    const input = document.getElementById("phoneNumberInput") as HTMLInputElement; 
    input.value = this.UtilsService.formatPhoneNumber(input.value);
    this.dealerForm.patchValue({
      contactNumber: input.value
    }); 
   /*  if (this.dealerForm.controls.contactNumber.valid)
      input.value = input.value ? this.UtilsService.formatPhoneNumber(input.value) : ''; */
  }
}
