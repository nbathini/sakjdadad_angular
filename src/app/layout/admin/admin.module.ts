import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AddDealerComponent } from './add-dealer/add-dealer.component';
import { ListDealerComponent } from './list-dealer/list-dealer.component';
import { StaffListingComponent } from './staff-listing/staff-listing.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { ManageDocumentsComponent } from './manage-documents/manage-documents.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminComponent } from './admin.component';
import { AddLinkModalComponent } from './add-link-modal/add-link-modal.component';
import { AppSharedModule } from '../dealer/app-shared/app-shared.module';


@NgModule({
  declarations: [
    AdminComponent,
    AddDealerComponent,
    ListDealerComponent,
    StaffListingComponent,
    AddStaffComponent,
    ManageDocumentsComponent,
    AuditLogsComponent,
    AddLinkModalComponent
  ],
  entryComponents: [AddLinkModalComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    AppSharedModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdminModule { }
