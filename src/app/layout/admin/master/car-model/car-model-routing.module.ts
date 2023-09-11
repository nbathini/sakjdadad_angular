import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarModelComponent } from './car-model.component';
import { CreateCarModelComponent } from './create-car-model/create-car-model.component';
import { ViewCarModelComponent } from './view-car-model/view-car-model.component';

const routes: Routes = [
  {
    path: '', component: CarModelComponent
  },
  {
    path: 'create', component: CreateCarModelComponent
  },
  {
    path: 'view/:id', component: ViewCarModelComponent
  },
  {
    path: 'edit/:id', component: CreateCarModelComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarModelRoutingModule { }
