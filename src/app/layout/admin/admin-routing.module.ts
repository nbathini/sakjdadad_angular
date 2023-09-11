import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/authorization/change-password/change-password.component';
import { AddDealerComponent } from './add-dealer/add-dealer.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { AdminComponent } from './admin.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { ListDealerComponent } from './list-dealer/list-dealer.component';
import { ManageDocumentsComponent } from './manage-documents/manage-documents.component';
import { StaffListingComponent } from './staff-listing/staff-listing.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      {
        path: 'all-dealers', component: ListDealerComponent
      },
      {
        path: 'add-dealer', component: AddDealerComponent
      },
      {
        path: 'edit-dealer/:id', component: AddDealerComponent
      },
      {
        path: 'edit-dealer/:id/:staffId', component: AddDealerComponent
      },
      {
        path: 'all-staff/:dealerId', component: StaffListingComponent
      },
      {
        path: 'add-staff/:dealerId', component: AddStaffComponent
      },
      {
        path: 'edit-staff/:dealerId/:id', component: AddStaffComponent
      },
      {
        path: 'manage-documents', component: ManageDocumentsComponent
      },
      {
        path: 'change-password', component: ChangePasswordComponent
      },
      {
        path: 'roles', loadChildren: () => import('./role/role.module').then(m => m.RoleModule)
      },
      {
        path: 'master', loadChildren: () => import('./master/master.module').then(m => m.MasterModule)
      },
      {
        path: 'manage-config', loadChildren: () => import('./manage-doc-config/manage-doc-config.module').then(m => m.ManageDocConfigModule)
      },
      {
        path: 'audit-logs', component: AuditLogsComponent
      },
      {
        path: '', redirectTo: 'all-dealers', pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
