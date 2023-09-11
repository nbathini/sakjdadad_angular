import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; 
import { ForgetComponent } from './authorization/forget/forget.component';
import { LoginComponent } from './authorization/login/login.component';  
import { SharedModule } from './shared/shared.module';
import { ChangePasswordComponent } from './authorization/change-password/change-password.component';
import { ResetPasswordComponent } from './authorization/reset-password/reset-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { AppSharedModule } from './layout/dealer/app-shared/app-shared.module';
import { PclAuthorizationComponent } from './authorization/pcl-authorization/pcl-authorization.component'; 
// AoT requires an exported function for factories
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'; 
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; 
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgetComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    PclAuthorizationComponent, 
  ], 
  imports: [
    BrowserModule,
    AppRoutingModule, 
    BrowserAnimationsModule, 
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppSharedModule
  ], 
  bootstrap: [AppComponent]
})

export class AppModule { }
