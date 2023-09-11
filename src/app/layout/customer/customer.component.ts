import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { ApiUrl } from 'src/app/core/apiUrl';
import { ActivatedRoute } from '@angular/router';
import { CustomerSurvey } from 'src/app/shared/models/survey.model';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customerSurveyJson: Array<CustomerSurvey> = [];

  customerName = '';
  centreName = '';
  model = '';
  deliveryTime: any = '';
  deliveryDate = '';
  surveyId = '';
  isSubmitted = false;
  isError = false;
  checkedFields: Array<any> = [];
  optionalField1: Array<any> = [];
  optionalField2: Array<any> = [];

  stepActive = 0;
  isLast = 0;
  token: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private message: MessageService
  ) {
    this.route.queryParams.subscribe(params => {
      this.token = params.token;
    });
  }

  ngOnInit(): void {
    this.getSurveyForm();
  }

  /*** Get Form Data ***/
  getSurveyForm(): void {
    this.http.getData(ApiUrl.survey.customerSurvey, { accessToken: this.token }).subscribe((response) => {
      if (!!response) {
        const result = response.result && response.result.questionResponse ? JSON.parse(response.result.questionResponse) : [];
        if (result.length) {
          this.isLast = response.result.isResponseSubmitted ? 1 : 0;
          this.isSubmitted = response.result.isResponseSubmitted;
          this.customerName = response.result.customerName ? response.result.customerName : '';
          this.centreName = response.result.centreName ? response.result.centreName : '';
          this.surveyId = response.result.id ? response.result.id : '';
          this.model = response.result.model ? response.result.model : '';
          this.deliveryTime = response.result.deliveryTime ? response.result.deliveryTime : '';
          this.deliveryDate = response.result.deliveryDate ? moment(response.result.deliveryDate).format('MMMM Do, YYYY') : '';
          this.customerSurveyJson = result.filter((el: any) => {
            el.Answer = el.Answer || '';
            if (el.Name === 'porscheHome') {
              this.optionalField1.push(el);
            }
            if (el.Name === 'recieveInfoHome') {
              this.optionalField2.push(el);
            }
            if (el.IsVisible) {
              return el;
            }
          });
        }
      }
    }, (err) => {
      this.isLast = 1;
      this.isSubmitted = true;
    });
  }

  /*** Update Delivery Checkbox values ***/
  updateCheckBox(i: number, val: string, evt: any): void {
    if (evt.checked) {
      if (!this.checkedFields.includes(val)) {

        this.checkedFields.push(val);
      }
    } else {
      const index = this.checkedFields.indexOf(val);
      if (index > -1) {
        this.checkedFields.splice(index, 1);
      }
    }
    if (this.checkedFields.length > 3) {
      this.isError = true;
    } else {
      this.isError = false;
    }
    if (this.isError) {
      this.message.toast('error', 'Please select up to 3 areas and we will ensure to allocate enough time during the delivery.');
    }
    if (this.checkedFields.length) {
      this.customerSurveyJson[i].Answer = this.checkedFields.join('|');
    } else {
      this.customerSurveyJson[i].Answer = '';
    }

  }

  /*** Submit survey ***/
  submitSurvey(): void {
    const params = {
      id: this.surveyId,
      customerName: this.customerName,
      model: this.model,
      isResponseSubmitted: this.isSubmitted,
      questionResponse: JSON.stringify(this.customerSurveyJson),
      token: this.token
    };
    this.http.postData(ApiUrl.survey.submitCustomerResponse, params).subscribe((response) => {
      if (!!response) {
        this.isSubmitted = true;
      }
    });
  }

  /*** Complete survey ***/
  complete(): void {
    if (this.isError) {
      this.message.toast('error', 'Please select up to 3 areas and we will ensure to allocate enough time during the delivery.');
      return;
    }
    this.submitSurvey();
    this.isLast = 1;
  }

  /*** Confirm Quit Survey ***/
  submitLater(): void {
    this.message.confirm('quit the survey').then(data => {
      if (data.value) {
        if (this.isError) {
          this.message.toast('error', 'Please select up to 3 areas and we will ensure to allocate enough time during the delivery.');
          return;
        }
        this.isLast = 1;
      }
    });
  }

  /*** Start Survey Again ***/
  startAgain(): void {
    this.stepActive = 1;
    this.isLast = 0;
  }

  /*** Check For Home Charger wherther Yes or no ***/
  checkAnswer(field: string, answer: string | null): void {
    if (field === 'chargerHome') {
      if (answer && answer === 'No') {
        this.customerSurveyJson.splice(5, 0, this.optionalField1[0]);
      } else {
        this.customerSurveyJson = this.customerSurveyJson.filter((el: any) => {
          if (el.Name !== 'porscheHome' && el.Name !== 'recieveInfoHome') {
            return el;
          }
        });

      }
    }
    if (field === 'porscheHome') {
      if (answer && answer === 'No') {
        this.customerSurveyJson.splice(6, 0, this.optionalField2[0]);
      } else {
        this.customerSurveyJson = this.customerSurveyJson.filter((el: any) => {
          if (el.Name !== 'recieveInfoHome') {
            return el;
          }
        });

      }
    }
  }

  /*** Navigate to next question ***/
  goToStep(step: string): void {
    if (this.isError) {
      this.message.toast('error', 'Please select up to 3 areas and we will ensure to allocate enough time during the delivery.');
      return;
    }

    this.stepActive = step === 'prev' ? this.stepActive - 1 : this.stepActive + 1;
    this.isLast = 0;
  }
}
