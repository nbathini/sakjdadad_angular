import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';  
const routes: Routes = [  
  {
    path: 'survey', loadChildren: () => import('./layout/customer/customer.module').then(m => m.CustomerModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
