import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarModelRoutingModule } from './car-model-routing.module';
import { CarModelComponent } from './car-model.component';
import { CreateCarModelComponent } from './create-car-model/create-car-model.component';
import { ViewCarModelComponent } from './view-car-model/view-car-model.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CarModelComponent, CreateCarModelComponent, ViewCarModelComponent],
  imports: [
    CommonModule,
    CarModelRoutingModule,
    SharedModule
  ]
})
export class CarModelModule { }
