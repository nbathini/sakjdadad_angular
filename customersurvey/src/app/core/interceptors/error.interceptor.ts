import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageService } from 'src/app/services/message/message.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private user: UserService,
    private message: MessageService,
    private loader: LoaderService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {

            switch (event.body.status) {
              case 401:
                /*** Auto logout if 401 response returned from api ***/
                this.loader.hide();
                this.message.toast('error', event.body.message);
                this.user.userSignOut();
                break;
              case 0:
                /*** If server dosent respond ***/
                this.loader.hide();
                this.message.toast('error', 'HTTP Error Response.');
                break;
              case 400: case 500: case 8: case 404:
                /*** Check for other serve-side errors ***/
                this.loader.hide();
                this.message.toast('error', event.body.message);
                break;
            }
          }
        }, error => {
          this.loader.hide();
          switch (error.status) {
            case 401:
              /*** Auto logout if 401 response returned from api ***/
              this.loader.hide();
              this.message.toast('error', error.error.message);
              this.user.userSignOut();
              break;
            case 503:
              /*** service unavailable ***/
              this.loader.hide();
              this.message.toast('error', 'Service Unavailable, Server Error.');
              break;
            case 0:
              /*** If server dosent respond ***/
              this.loader.hide();
              this.message.toast('error', 'HTTP Error Response.');
              break;
            default:
              /*** Check for other serve-side errors ***/
              if (!!error.error) {
                this.loader.hide();
                this.message.toast('error', error.error.message);
              }
              break;
          }
        }));
  }
}
