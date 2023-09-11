import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { UserService } from 'src/app/services/user/user.service';
import { Patterns } from 'src/app/shared/models/patterns.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({});
  isSubmitted = false;
  isLoading = false;
  isAdmin = false;
  validationPattern = new Patterns();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private user: UserService,
    private message: MessageService,
    private http: HttpService
  ) {
    this.createLoginForm();
  }

  ngOnInit(): void {
    if (this.router.url.indexOf('/admin') > -1) {
      this.isAdmin = true;
    }
  }

  /*** Intialize Login Form ***/
  createLoginForm(): void {

    this.loginForm = this.formBuilder.group({
      userEmail: ['', [Validators.required, Validators.pattern(this.validationPattern.emailPattern)]],
      password: ['', [Validators.required]]
    });
  }

  /*** Get Login Form Controls ***/
  get userForm(): any {
    return this.loginForm.controls;
  }

  /*** Trim form values ***/
  trim(key: string): void {
    this.loginForm.controls[key].patchValue(this.loginForm.controls[key].value.trim());
  }

  /*** Submit Login Form ***/
  onSubmit(): void {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 10000);
      return;
    }
    const params = { ...this.loginForm.value };
    this.isLoading = true;
    const url = ApiUrl.auth.login;
    this.http.postData(url, params).subscribe((response) => {
      console.log("response", response, !!response);
      this.isLoading = false;
      if (!!response) {
        this.user.setUserLocalData(response.result);
        this.message.toast('success', response.message);
        if (response.result.roleInfo.roleGroup === 'Admin') {
          this.router.navigate(['admin/all-dealers']);
        }
        else {
          this.router.navigate(['']);
        }

      }
    }, (err) => {
      this.isLoading = false;
    });

  }

  /*** Navigate to forgot password page ***/
  forgotPassword(): void {
    if (this.isAdmin) {
      this.router.navigate(['admin/forgot-password']);
    } else {
      this.router.navigate(['/forgot-password']);
    }
  }

}
