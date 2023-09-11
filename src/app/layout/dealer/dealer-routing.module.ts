import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DealerComponent } from './dealer.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { SurveyComponent } from './survey/survey.component';

const routes: Routes = [
  {
    path: '', component: DealerComponent, children: [
      {
        path: '', component: DashboardComponent
      },
      {
        path: 'add-delivery', component: DeliveryComponent
      },
      {
        path: 'edit-delivery/:deliveryId', component: DeliveryComponent
      },
      {
        path: 'survey/:id', component: SurveyComponent
      }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealerRoutingModule { }
