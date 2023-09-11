import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { CustomerDelivery } from 'src/app/shared/models/delivery.model';
import { Fields, Survey } from 'src/app/shared/models/survey.model';
import { MatDialog } from '@angular/material/dialog';
import { PdfComponent } from './pdf/pdf.component';
import swal from 'sweetalert2';
import { DeliveryTypePopupComponent } from './delivery-type-popup/delivery-type-popup.component';
import { UserService } from 'src/app/services/user/user.service';
import { appConfig } from 'src/app/core/app-conf';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit, DoCheck {
  appConfig = appConfig;
  isLoading = false;
  isSubmitted = false;
  surveySent = false;
  skipSurvey = false;
  surveyFilled = true;
  showPdf = false;
  deliveryId: any;
  checkListId: any;
  surveyData: any;
  modelName = [];
  deliverData = new CustomerDelivery();
  questionCount = 0;
  attemptCount = 0;
  selectedIndex = 0;
  preDeliveryCheckListId = 0;
  checkedFields: Array<any> = [];
  checklistData: Array<any> = [];
  documentsData: Array<any> = [];
  surveyPrepration: Array<Survey> = [];
  customerSurveyJson: any = {};
  vehicleName = '';
  charger = '';
  surveyPreparationJson: Array<any> = [];
  deliveryChecklist: Array<Fields> = [];
  rolePermissions: any;
  disableMode = true;

  constructor(
    private router: Router,
    private http: HttpService,
    private message: MessageService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private user : UserService
  ) { }

  ngOnInit(): void {
    this.deliveryId = this.route.snapshot.paramMap.get('id');
    Promise.all([
      this.getDeliveryDetails(),
      this.getSurveyData(1),
      this.getPreDeliveryCheckList(),
      this.getFollowUpCheckList(),
    ]).catch(error => {
      console.log('error:- ', error);
    });
    this.rolePermissions = this.user.getRoleGroup();
    if(this.rolePermissions?.isCreate || this.rolePermissions?.isEdit){ this.disableMode = false;}
  }

  ngDoCheck(): void {
    // Checks number of questions filled
    let totalQues = 0;
    let totalAttempt = 0;
    this.surveyPrepration.forEach((val) => {
      val.fields.map((field) => {
        totalQues++;
        if (field.answer) { totalAttempt++; }
      });
    });
    this.questionCount = totalQues;
    this.attemptCount = totalAttempt;
  }

  /*** Get Delivery Details ***/
  getDeliveryDetails(): void {
    this.isLoading = true;
    const url = ApiUrl.dealer.delivery + '/' + this.deliveryId;

    this.http.getData(url).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result = response.result ? response.result : {};

        if (!response.result && response.message) {
          this.message.toast('error', response.message);
          this.router.navigate(['']);

        }
        this.deliverData = result;
        this.modelName = result && result.model && result.model.name ? result.model.name.split(' ') : [];
        this.skipSurvey = this.deliverData.skipSurvey ? this.deliverData.skipSurvey : false;
        this.getInfoSheetData();
      }
    }, err => {
      this.router.navigate(['']);
    });
  }

  /*** Get Delivery Prepration Form ***/
  getSurveyData(type: number): void {
    this.isLoading = true;
    this.http.getData(ApiUrl.survey.getDeliveryPreparation, { deliveryId: this.deliveryId, questionType: type }).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result = response.result && response.result.questionResponse ? JSON.parse(response.result.questionResponse) : [];
        this.surveyPrepration = result;
        this.surveySent = response.result.id || false;
        result.forEach((section: Survey) => {
          section.fields.forEach((field: Fields) => {
            if (field.type === 'checkbox') {
              this.checkedFields = field.answer ? field.answer.split(', ') : [];
            }
          });

        });
      }
    }, error => {
      console.log('error:- ', error);
    });
  }

  /*** Get InfoSheet Details ***/
  getPreDeliveryCheckList(): void {
    this.http.getData(ApiUrl.survey.preDeliveryChecklist, { deliveryId: this.deliveryId }).subscribe((response) => {
      if (!!response) {
        const result = response.result && response.result.questionResponse ? JSON.parse(response.result.questionResponse) : [];
        this.preDeliveryCheckListId = response.result.id;
        result.map((el: any) => {
          el.answer = el.answer || '';
        });
        this.deliveryChecklist = result;
      }
    }, error => {
      console.log('error:- ', error);
    });
  }

  /*** Get InfoSheet Details ***/
  getInfoSheetData(): void {
    this.isLoading = true;
    this.http.getData(ApiUrl.survey.infoSheetInformation, { deliveryId: this.deliveryId, customerId: this.deliverData.customerId })
      .subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.surveyFilled = !!response.result;
          this.surveyData = response.result;
          const surveyPreparationJson = response.result && response.result.surveyPreparationJson ?
            JSON.parse(response.result.surveyPreparationJson) : [];
          const customerSurveyJson = response.result && response.result.customerSurveyJson ?
            JSON.parse(response.result.customerSurveyJson) : [];

          this.surveyPreparationJson = [];
          if (surveyPreparationJson.length) {
            this.selectedIndex = 1;

            surveyPreparationJson.map((val: any) => {
              val.fields.map((v: any) => {
                if (v.name === 'previousVehicle') {
                  this.vehicleName = this.vehicleName ? this.vehicleName : v.answer;
                }
                if (v.name === 'charger') {
                  this.charger = v.answer;
                }
                if (v.isInfoSheet) { this.surveyPreparationJson.push(v); }
              });
            });
          }
          if (customerSurveyJson.length) {
            customerSurveyJson.map((v: any) => {
              if (v.Name === 'currentVehicle') { this.vehicleName = v.Answer ? v.Answer : this.vehicleName; }
              this.customerSurveyJson[v.Name] = v.Answer || '';
              if (v.Name === 'receiveInfo') { this.customerSurveyJson[v.Name] = v.Answer === 'Yes' ? v.Question : ''; }
            });
          }
        }
      }, error => {
        console.log('error:- ', error);
      });
  }

  /*** Get Post Delivery CheckList and Customer Follow Up List ***/
  getFollowUpCheckList(): void {
    this.http.getData(ApiUrl.survey.DeliveryChecklist, { deliveryId: this.deliveryId }).subscribe((response) => {
      if (!!response) {
        const result = response.result && response.result.questionResponse ? JSON.parse(response.result.questionResponse) : [];
        this.checklistData = result;
        this.checkListId = response.result && response.result.id ? response.result.id : 0;
      }
    }, error => {
      console.log('error:- ', error);
    });
  }

  /*** Submit Delivery Prepration Form ***/
  submitDeliveryCheckList(): void {
    const params = {
      id: 0,
      deliveryId: +(this.deliveryId),
      questionResponse: JSON.stringify(this.deliveryChecklist)
    };

    for (const i in this.deliveryChecklist) {
      if (this.deliveryChecklist[i].is_required && !this.deliveryChecklist[i].answer) {
        this.message.toast('error', 'Please fill all the required fields');
        return;
      }
    }
    console.log("submitDeliveryCheckList",ApiUrl.survey.preDeliveryChecklist,params);
    this.http.postData(ApiUrl.survey.preDeliveryChecklist, params).subscribe((response) => {
      if (!!response) {
        this.message.toast('success', response.message);
        this.getPreDeliveryCheckList();
        this.nextStep();
      }
    }, error => {
      console.log('error:- ', error);
    });
  }

  /*** Submit Delivery Prepration Form ***/
  submitSurveyForm(): void {
    if (this.surveySent) {
      this.nextStep();
      return;
    }
    this.isSubmitted = true;
    loop1:
    for (const i in this.surveyPrepration) {
      if (this.surveyPrepration.hasOwnProperty(i)) {
        loop2:
        for (const j in this.surveyPrepration[i].fields) {
          if (this.surveyPrepration[i].fields[j].is_required &&
            !this.surveyPrepration[i].fields[j].answer) {
            this.message.toast('error', 'Please fill all the required fields');
            return;
          }
        }
      }
    }
    this.isLoading = true;
    const params = {
      id: 0,
      deliveryId: +(this.deliveryId),
      customerId: this.deliverData.customerId,
      questionResponse: JSON.stringify(this.surveyPrepration)
    };
    this.http.postData(ApiUrl.survey.customerSurvey, params).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        this.message.toast('success', response.message);
        this.isSubmitted = false;
        this.deliverData.isSurveySent = true;
        this.surveySent = true;
        this.selectedIndex = 1;
        this.getInfoSheetData();
      }
    }, error => {
      console.log('error:- ', error);
    });
  }

  /*** Submit Post Delivery/Customer Follow Up Checklist ***/
  submitDeliveryCheckListSec(event: any): void {
    this.checklistData = event;
    const params = {
      id: +(this.checkListId),
      deliveryId: +(this.deliveryId),
      questionResponse: JSON.stringify(this.checklistData)
    };
    this.http.postData(ApiUrl.survey.DeliveryChecklist, params).subscribe((response) => {
      if (!!response) {
        this.message.toast('success', response.message);
        this.getFollowUpCheckList();
        this.nextStep();
      }
    }, error => {
      console.log('error:- ', error);
    });
  }

  /*** Send Documents to User ***/
  sendDocuments(event: any): void {
    const params = {
      checkListId: +(this.checkListId),
      deliveryId: +(this.deliveryId),
      customerId: this.deliverData.customerId,
      fileList: event.fileList,
      linkList: event.linkList,
      deliveryStatus: 1
    };
    const dialogRef = this.dialog.open(DeliveryTypePopupComponent, { panelClass: 'doc-type-popup' });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        params.deliveryStatus = data;
        this.http.postData(ApiUrl.survey.sendDocuments, params).subscribe((response) => {
          if (!!response) {
            this.message.toast('success', response.message);
            this.getFollowUpCheckList();
          }
        }, error => {
          console.log('error:- ', error);
        });
      }
    });

  }

  /*** Update Delivery Checkbox values ***/
  updateDeliveryCheckBox(i: number, evt: any): void {
    if (evt.checked) {
      this.deliveryChecklist[i].answer = 'Yes';
      this.deliveryChecklist[i].checked = true;
    } else {
      this.deliveryChecklist[i].answer = '';
      this.deliveryChecklist[i].checked = false;
    }
  }

  /*** Update Delivery Checkbox values ***/
  updateCheckBox(i: number, j: number, val: string, evt: any): void {
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
    if (this.checkedFields.length) {
      this.surveyPrepration[i].fields[j].answer = this.checkedFields.join(', ');
    } else {
      this.surveyPrepration[i].fields[j].answer = '';
    }
  }

  /*** Print/Download Pdf ***/
 printPdf(download: boolean): void {
  const dialogRef = this.dialog.open(PdfComponent, { 
    data: { deliverData: this.deliverData, surveyData: this.surveyData, download }
  });
  dialogRef.componentInstance.printPdf();
}

  /*** On Tab Change ***/
  tabChanged(tabChangeEvent: any): void {
    this.selectedIndex = tabChangeEvent.index;
  }

  /*** Next Tab ***/
  nextStep(): void {
    this.selectedIndex += 1;
  }

  /*** Previous Tab ***/
  previousStep(): void {
    this.selectedIndex -= 1;
  }
}
