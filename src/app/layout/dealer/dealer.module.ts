import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealerRoutingModule } from './dealer-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DealerComponent } from './dealer.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { SurveyComponent } from './survey/survey.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalenderComponent } from './common/calender/calender.component';
import { DeliveryChecklistComponent } from './survey/delivery-checklist/delivery-checklist.component';
import { SecondDeliveryChecklistComponent } from './survey/second-delivery-checklist/second-delivery-checklist.component';
import { PdfComponent } from './survey/pdf/pdf.component';
import { DocumentsComponent } from './survey/documents/documents.component';
import { DocViewPopupComponent } from './survey/doc-view-popup/doc-view-popup.component';
import { DeliveryTypePopupComponent } from './survey/delivery-type-popup/delivery-type-popup.component';
import { HeaderComponent } from './common/header/header.component';
import { AppSharedModule } from './app-shared/app-shared.module';


@NgModule({
  declarations: [ 
    DashboardComponent,
    DealerComponent,
    DeliveryComponent,
    SurveyComponent,  
    DeliveryChecklistComponent,
    SecondDeliveryChecklistComponent, 
    PdfComponent, 
    DocumentsComponent, 
    DocViewPopupComponent,
    DeliveryTypePopupComponent, ],
  imports: [
    CommonModule,
    DealerRoutingModule,
    SharedModule,
    AppSharedModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class DealerModule { }
