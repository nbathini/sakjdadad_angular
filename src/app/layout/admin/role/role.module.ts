import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { AddRoleComponent } from './add-role/add-role.component';
import { ViewRoleComponent } from './view-role/view-role.component';
import { RoleComponent } from './role.component'; 
import { SharedModule } from 'src/app/shared/shared.module'; 

@NgModule({
  declarations: [AddRoleComponent, ViewRoleComponent, RoleComponent],
  imports: [
    CommonModule,
    RoleRoutingModule, 
    SharedModule, 
  ]
})
export class RoleModule { }
