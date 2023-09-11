import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoaderService } from '../loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private loader: LoaderService
  ) { }

  /******************** HTTP Get Request ********************/
  getData(url: string, params?: { [x: string]: any; }, ignoreLoader?: boolean): Observable<any> {
    if (!ignoreLoader) this.loader.show();
    const paramsData = params ? { params: this.appendParams(params) } : {};
    return this.http.get<any>(environment.BASE_URL + url, paramsData)
      .pipe(
        map((response: any) => {
          this.loader.hide();
          if (response.statusCode === 200) {
            return response;
          }
        })
      );
  }
  getAPi(url: string, params?: { [x: string]: any; }, ignoreLoader?: boolean): Observable<any> {
    if (!ignoreLoader) this.loader.show();
    const paramsData = params ? { params: this.appendParams(params) } : {};
    return this.http.get<any>(environment.BASE_URL + url, paramsData)
      .pipe(
        map((response: any) => {
          this.loader.hide();
          if (response.statusCode === 200) {
            return response;
          }
        })
      );
  }
  /******************** HTTP Post Request ********************/
  postData(url: string, data: { [x: string]: any; }): Observable<any> {
    this.loader.show();
    return this.http.post<HttpClient>(environment.BASE_URL + url, data)
      .pipe(
        map((response: any) => {
          this.loader.hide();
          if (response.statusCode === 200) {
            return response;
          }
        })
      );
  }

  /******************** HTTP Put Request ********************/
  putData(url: string, data: { [x: string]: any; }): Observable<any> {
    this.loader.show();
    return this.http.put<HttpClient>(environment.BASE_URL + url, data)
      .pipe(
        map((response: any) => {
          this.loader.hide();
          if (response.statusCode === 200) { return response; }
        })
      );
  }

  /******************** HTTP Delete Request ********************/
  deleteData(url: string, id: string): Observable<any> {
    this.loader.show();
    return this.http.delete<HttpClient>(environment.BASE_URL + url + '/' + id)
      .pipe(map((response: any) => {
        this.loader.hide();
        if (response.statusCode === 200) { return response; }
      })
      );
  }
  deleteRecord(url: string): Observable<any> {
    this.loader.show();
    return this.http.delete<HttpClient>(environment.BASE_URL + url)
      .pipe(map((response: any) => {
        this.loader.hide();
        if (response.statusCode === 200) { return response; }
      })
      );
  }

  /******************** HTTP Formdata ********************/
  appendFormData(myFormData: { [x: string]: any; }): FormData {
    const fd = new FormData();
    for (const key in myFormData) {
      if (myFormData.hasOwnProperty(key)) {
        fd.append(key, myFormData[key]);
      }
    }
    return fd;
  }

  /******************** HTTP Params ********************/
  appendParams(myParams: { [x: string]: any; }): HttpParams {
    let params = new HttpParams();
    for (const key in myParams) {
      if (myParams.hasOwnProperty(key)) {
        params = params.append(key, myParams[key]);
      }
    }
    return params;
  }
}
