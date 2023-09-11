import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUserSubject = new BehaviorSubject(null);
  currentUser = this.currentUserSubject.asObservable();
  requestData: any;

  constructor(
    private router: Router,
    private http: HttpService
  ) {

    /*** Check currentUser from local storage ***/
    let userData: any = null;
    try {
      userData = localStorage.getItem('userData') ? localStorage.getItem('userData') : null;
      userData = userData ? JSON.parse(userData) : null;
      this.currentUserSubject = new BehaviorSubject<any>(userData.data);

    } catch (error) {
      if (error instanceof SyntaxError) { this.removeUser(); }
    }
  }

  /*** Get the current value of user ***/
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  /*** Get the current value of user ***/
  public get userRole(): any {
    if (!this.currentUserValue || !this.currentUserValue.accessToken) { return false; }
    const base64Url = this.currentUserValue.accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).role;
  }

  /*** Get the current user token ***/
  public get getUserToken(): any {
    if (!!this.currentUserValue) { return this.currentUserValue.accessToken; }
  }

  getRoleGroup() {
    let userData: any = localStorage.getItem('userData') ? localStorage.getItem('userData') : null;
    userData = userData ? JSON.parse(userData) : null;
    return userData?.data?.roleInfo;
  }
  /*** Set user in local storage ***/
  /*  setUserLocalData(userData: any): void {
     localStorage.setItem('userData', JSON.stringify(userData));
     this.currentUserSubject.next(userData);
   } */
  setUserLocalData(data: any): void {
    const userData = {
      data: data,
      timestamp: new Date().getTime() + 60 * 2 * 1000
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    this.currentUserSubject.next(userData.data);
  }
  checkSession() {
    const storedData = localStorage.getItem('userData');
    console.log("storedData", storedData);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const currentTime = new Date().getTime();
      console.log("storedData", currentTime, parsedData.timestamp, currentTime <= parsedData.timestamp);
      if (currentTime <= parsedData.timestamp) {
        console.log(parsedData.data);
      } else {
        this.userSignOut();
         this.router.navigate(['/login']);
      //  this.getUserData();
      }
    } else {
      console.log("No session");
       this.router.navigate(['/login']);
    //  this.router.navigate(['/pcl-auth']);
    }
  }
  getUserData() {
    this.http.getData('auth/getppnuserinfo').subscribe(
      (response: any) => {
        console.log(response);
        if (!!response) {
          this.requestData = response.result ? response.result : {};
          this.userVerify();
        }
      },

      (error: any) => {
        console.error('Error fetching protected resource:', error);
        this.router.navigate(['/pcl-auth']);
        // Handle error 
      }
    );
  }

  userVerify(): void {
    const submitData = {
      email: this.requestData.email,
      firstName: this.requestData.name,
      lastName: this.requestData.given_name,
      phone: this.requestData.phone ? this.requestData.phone : '',
      centreName: this.requestData.centrename,
      roleName: this.requestData.app_roles,
    }
    const params = { ...submitData };
    const url = ApiUrl.auth.pclLogin;
    this.http.postData(url, params).subscribe((response) => {
      if (!!response) {
        if (response.result.roleInfo.roleGroup === 'Admin') {
          this.router.navigate(['admin/all-dealers']);
        }
        else {
          this.router.navigate(['dealer']);
        }
      }
    }, (err) => {
    });
  }

  /*** Remove user from local storage ***/
  removeUser(): void {
    localStorage.removeItem('userData');
    if (this.currentUserSubject) {
      this.currentUserSubject.next(null);
    }
  }

  /*** User Sign-Out ***/
  userSignOut(): void {
    this.removeUser();
    //  this.router.navigate(['/login']);
  }

  /*** User Sign-Out ***/
  adminSignOut(): void {
    this.removeUser();
    this.router.navigate(['/admin/login']);
  }
}
