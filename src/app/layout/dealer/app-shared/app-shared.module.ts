import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalenderComponent } from '../common/calender/calender.component';
import { FooterComponent } from '../common/footer/footer.component';
import { HeaderComponent } from '../common/header/header.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    CalenderComponent,
    FooterComponent,
    HeaderComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CalenderComponent,
    FooterComponent,
    HeaderComponent],
})
export class AppSharedModule { }
