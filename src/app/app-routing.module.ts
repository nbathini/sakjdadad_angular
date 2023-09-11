import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgetComponent } from './authorization/forget/forget.component';
import { ChangePasswordComponent } from './authorization/change-password/change-password.component';
import { LoginComponent } from './authorization/login/login.component'; 
import { ResetPasswordComponent } from './authorization/reset-password/reset-password.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { LoginGuard } from './core/guards/login/login.guard';  
import { AdminGuard } from './core/guards/admin/admin.guard';
import { PdfComponent } from './layout/dealer/survey/pdf/pdf.component'; 
import { PclAuthorizationComponent } from './authorization/pcl-authorization/pcl-authorization.component';
const routes: Routes = [ 
  {
    path: 'admin', loadChildren: () => import('./layout/admin/admin.module').then(m => m.AdminModule),  canActivate: [AdminGuard]
  },
  {
    path: 'customer', loadChildren: () => import('./layout/customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: '', loadChildren: () => import('./layout/dealer/dealer.module').then(m => m.DealerModule), canActivate: [AuthGuard]
  },
  {
    path: 'login', component: LoginComponent, canActivate: [LoginGuard]
  },
  {
    path: 'pcl-auth', component: PclAuthorizationComponent
  },
  {
    path: 'admin/login', component: LoginComponent, canActivate: [LoginGuard]
  },
  {
    path: 'forgot-password', component: ForgetComponent, canActivate: [LoginGuard]
  },
  {
    path: 'admin/forgot-password', component: ForgetComponent, canActivate: [LoginGuard]
  },
  {
    path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]
  },
  {
    path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoginGuard]
  },
  {
    path: 'admin/reset-password', component: ResetPasswordComponent, canActivate: [LoginGuard]
  },
  {
    path: 'set-password', component: ResetPasswordComponent, canActivate: [LoginGuard]
  },
  {
    path: '**', redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
