import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiUrl } from 'src/app/core/apiUrl';

import { HttpService } from 'src/app/services/http/http.service';
import * as moment from 'moment';
import { MessageService } from 'src/app/services/message/message.service';
import { CommonModel, CustomerDelivery } from 'src/app/shared/models/delivery.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Patterns } from 'src/app/shared/models/patterns.model';
import { User } from 'src/app/shared/models/user.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilsService } from 'src/app/core/utils.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  deliveryId: any;

  deliverData = new CustomerDelivery();
  deliveryForm = new FormGroup({});
  porscheModels: Array<CommonModel> = [];
  deliverTypes: Array<CommonModel> = [];
  isSubmitted = false;
  isLoading = false;
  today = moment(new Date()).format('YYYY-MM-DD');
  minTime = moment(new Date()).format('LT');
  validationPattern = new Patterns();
  consultants: Array<User> = [];
  advisors: Array<User> = [];
  porschePros: Array<User> = [];
  skipSurvey: false;
  isTouched = false;
  isEmailTouched = false;
  isContactTouched = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private http: HttpService,
    private UtilsService: UtilsService,
    private datePipe: DatePipe
  ) {
    this.createDeliveryForm();
  }

  ngOnInit(): void {
    this.deliveryId = this.route.snapshot.paramMap.get('deliveryId');
    this.getPorshceModels();
    this.getAllStaff();
    const inputElement = document.getElementById('phoneNumberInput') as HTMLInputElement;
    inputElement.addEventListener('keydown', (event) => {
      // Allow key codes for digits and necessary control keys (e.g., backspace, delete, arrow keys)
      const allowedKeyCodes = [8, 9, 37, 39, 46]; // Backspace, Tab, Left Arrow, Right Arrow, Delete

      if (!allowedKeyCodes.includes(event.keyCode) && (event.key < '0' || event.key > '9')) {
        event.preventDefault();
      }
    });
  }

  /*** Create Delivery Form ***/
  createDeliveryForm(): void {
    this.deliveryForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.pattern(this.validationPattern.emailPattern)]],
      model: ['', Validators.required],
      deliveryDate: [this.today],
      deliveryTime: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(this.validationPattern.telPattern)]],
      porschePro: ['', Validators.required],
      salesConsultant: ['', Validators.required],
      serviceAdvisor: ['', Validators.required],
      deliveryType: ['', Validators.required],
      skipSurvey: [false]
    });

  }

  errorNull(controlName: string): void {
    if (controlName == 'customerEmail')
      this.isEmailTouched = false;
    if (controlName == 'contactNumber')
      this.isContactTouched = false;
  }

  validateControl(controlName: string): void {
    const control = this.deliveryForm.get(controlName);
    control?.markAsTouched();
    if (controlName == 'customerEmail')
      this.isEmailTouched = true;
    if (controlName == 'contactNumber')
      this.isContactTouched = true;
  }
  onKeyUp(event: KeyboardEvent): void {
    // Disable keyboard input
    event.preventDefault();
  }
  /*** Get Delivery Details ***/
  getDeliveryDetails(): void {
    const url = ApiUrl.dealer.delivery + '/' + this.deliveryId;

    this.http.getData(url).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result = response.result ? response.result : {};
        if (result) {
          this.setFormData(result);
        }
        else {
          this.message.toast('error', response.message);
          this.router.navigate(['']);
        }
      }
    }, (err) => {
      this.router.navigate(['']);
    });
  }
  /*** Set Default Values ***/
  setFormData(data: any): void {
    this.deliverData = data;
    this.deliveryForm.controls.customerName.patchValue(data.customerName, { onlySelf: true });
    this.deliveryForm.controls.customerEmail.patchValue(data.customerEmail, { onlySelf: true });
    this.deliveryForm.controls.model.patchValue(data.model, { onlySelf: true });
    this.deliveryForm.controls.deliveryDate.patchValue(data.deliveryDate, { onlySelf: true });
    this.deliveryForm.controls.deliveryTime.patchValue(moment(data.deliveryTime).format('LT'));
    console.log("data.deliveryTime",data.deliveryTime);
    this.checkMinDate();
    this.deliveryForm.controls.contactNumber.patchValue(data.contactNumber.includes('+1') ? + data.contactNumber.slice(2).replace(/\D/g, '').toString() : data.contactNumber.replace(/\D/g, '').toString(), { onlySelf: true });
    this.deliveryForm.controls.porschePro.patchValue(data.porschePro.name, { onlySelf: true });
    this.deliveryForm.controls.salesConsultant.patchValue(data.salesConsultant.name, { onlySelf: true });
    this.deliveryForm.controls.serviceAdvisor.patchValue(data.serviceAdvisor.name, { onlySelf: true });
    this.deliveryForm.controls.deliveryType.patchValue(data.deliveryType, { onlySelf: true });
    this.deliveryForm.controls.skipSurvey.patchValue(data.skipSurvey, { onlySelf: true });
    this.formatPhoneNumber();
  }
  formatPhoneNumber() {
    const input = document.getElementById("phoneNumberInput") as HTMLInputElement;
    input.value = this.UtilsService.formatPhoneNumber(input.value);
    this.deliveryForm.patchValue({
      contactNumber: input.value
    });

    /*  if (this.deliveryForm.controls.contactNumber.valid)
       input.value = input.value ? this.UtilsService.formatPhoneNumber(input.value) : ''; */
  }

  getAllStaff(): void {
    const response1 = this.http.getData(ApiUrl.dealer.getConsultants).pipe(
      catchError(err => of({ isError: true, error: err })),
    );
    const response2 = this.http.getData(ApiUrl.dealer.getPorschePros).pipe(
      catchError(err => of({ isError: true, error: err })),
    );
    const response3 = this.http.getData(ApiUrl.dealer.getAdvisors).pipe(
      catchError(err => of({ isError: true, error: err })),
    );
    const response4 = this.http.getData(ApiUrl.dealer.getDeliveryTypes).pipe(
      catchError(err => of({ isError: true, error: err })),
    );

    forkJoin([response1, response2, response3, response4]).subscribe((responseList: any) => {
      const responseData1 = responseList[0];
      const responseData2 = responseList[1];
      const responseData3 = responseList[2];
      const responseData4 = responseList[3];

      if (!!responseData1) {
        const result1 = responseData1.result ? responseData1.result : [];
        this.consultants = result1;
        if (!!responseData2) {
          const result2 = responseData2.result ? responseData2.result : [];
          this.porschePros = result2;
        }
        if (!!responseData3) {
          const result3 = responseData3.result ? responseData3.result : [];
          this.advisors = result3;
        }

        if (!!responseData4) {
          const result4 = responseData4.result ? responseData4.result : [];
          this.deliverTypes = result4;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  /*** Get Porshe  ***/
  getPorshceModels(): void {
    this.http.getData(ApiUrl.dealer.getCarModels).subscribe((response) => {
      if (!!response) {
        this.porscheModels = response.result ? response.result : [];
        if (this.deliveryId) { this.getDeliveryDetails(); }
      }
    });

  }

  /*** Get Login Form Controls ***/
  get dForm(): any {
    return this.deliveryForm.controls;
  }

  /*** Trim form values ***/
  trim(key: string): void {
    this.deliveryForm.controls[key].patchValue(this.dForm[key].value.trim());
  }

  /*** Check current Date ***/
  checkMinDate(): void {
    const today = moment(new Date());
    if (this.deliveryForm.controls.deliveryDate.value) {
      const deliveryDate = moment(this.deliveryForm.controls.deliveryDate.value);
      this.minTime = '00:00 AM';
      if (!deliveryDate.isSameOrAfter(today, 'day')) {
        this.deliveryForm.controls.deliveryDate.patchValue(this.today);
        this.deliveryForm.controls.deliveryTime.patchValue(today.format('LT'));
        this.minTime = today.format('LT');
        console.log(this.minTime, this.deliveryForm.value.deliveryTime)
      }else{ 
        setTimeout(()=>{
          this.deliveryForm.controls.deliveryTime.patchValue(moment(this.deliverData.deliveryTime).format('LT'));
          console.log("else",this.minTime, this.deliveryForm.value.deliveryTime)
        },100)
        
      }
    } else {
      this.deliveryForm.controls.deliveryDate.patchValue(this.today);
      this.deliveryForm.controls.deliveryTime.patchValue(today.format('LT'));
      this.minTime = today.format('LT');
      console.log("else 1",this.minTime, this.deliveryForm.value.deliveryTime)

    }
  }

  /*** Submit Form ***/
  onSubmit(): void {

    this.isSubmitted = true;
    if (!this.deliveryForm.valid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 20000);
      return;
    }
    const params = {
      ...this.deliveryForm.value
    };
    params.contactNumber = params.contactNumber.toString();
    params.contactNumber = !params.contactNumber.includes('+1') ? '+1 ' + params.contactNumber : params.contactNumber;
    params.deliveryDate = moment(params.deliveryDate).format('YYYY-MM-DD');
    const utcDeliveryTime = moment((params.deliveryDate + ' ' + params.deliveryTime), 'YYYY-MM-DD HH:mm a').format();
    params.deliveryTime = utcDeliveryTime.split('+')[0];
    const proscheProExist = this.porschePros.filter((el) => el.name === params.porschePro);
    const consultantExist = this.consultants.filter((el) => el.name === params.salesConsultant);
    const advisorExist = this.advisors.filter((el) => el.name === params.serviceAdvisor);
    if (!proscheProExist.length || !consultantExist.length || !advisorExist.length) {
      if (!proscheProExist.length) { this.message.toast('error', 'Please select Porsche Pro from list'); }
      if (!consultantExist.length) { this.message.toast('error', 'Please select Sales Consultant from list'); }
      if (!advisorExist.length) { this.message.toast('error', 'Please select Service Advisor from list'); }
      return;
    }
    params.porschePro = proscheProExist[0];
    params.salesConsultant = consultantExist[0];
    params.serviceAdvisor = advisorExist[0];

    this.isLoading = true;
    if (this.deliveryId) {
      params.id = +(this.deliveryId);
      if (this.deliverData.customerId) { params.customerId = +(this.deliverData.customerId); }
      this.http.putData(ApiUrl.dealer.delivery, params).subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.message.toast('success', response.message);
          this.isSubmitted = false;
          this.router.navigate(['']);
        }
      }, (err) => {
        this.isLoading = false;
      });
    } else {
      this.http.postData(ApiUrl.dealer.delivery, params).subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.message.toast('success', response.message);
          this.deliveryForm.reset();
          this.isSubmitted = false;
          this.router.navigate(['']);
        }
      }, (err) => {
        this.isLoading = false;
      });
    }

  }

  updateSkipSurvey(evt: any): void {
    if (evt.checked) {
      this.dForm.skipSurvey.patchValue(true);
    } else {
      this.dForm.skipSurvey.patchValue(false);
    }
  }
}
