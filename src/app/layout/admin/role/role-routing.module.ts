import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StaffListingComponent } from '../staff-listing/staff-listing.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { RoleComponent } from './role.component';
import { ViewRoleComponent } from './view-role/view-role.component';

const routes: Routes = [
 
  {
    path: 'add-role',
    component: AddRoleComponent
  }, 
  {
    path: 'edit-role/:id', component: AddRoleComponent
  },
  {
    path: 'view-role/:id',
    component: ViewRoleComponent
  },
  {
    path: '',
    component: RoleComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
