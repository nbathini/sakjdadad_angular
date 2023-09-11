import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  isAdmin = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private message: MessageService,
    private http: HttpService
  ) {
    this.createResetForm();
  }

  ngOnInit(): void {
    if (this.router.url.includes('/admin')) {
      this.isAdmin = true;
    }
  }

  /*** Intialize Form ***/
  createResetForm(): void {
    const pattern1 = new RegExp(/^(?=.*\d)(?=.*[A-Z]).{8,15}$/);
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern(pattern1)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.checkPasswords
    });
  }

  /*** Validation for password and Confirm password ***/
  checkPasswords(group: FormGroup): { [key: string]: any } | null {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;
    if (pass && confirmPass) { return pass === confirmPass ? null : { notSame: true }; }
    return null;
  }


  /*** Submit Form ***/
  onSubmit(): void {

    this.isSubmitted = true;
    if (!this.changePasswordForm.valid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 20000);
      return;
    }
    const params = {
      ...this.changePasswordForm.value
    };
    delete params.confirmPassword;
    this.isLoading = true;
    const url = this.isAdmin ? ApiUrl.admin.changePassword : ApiUrl.auth.changePassword;

    this.http.postData(url, params).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        this.message.toast('success', response.message);
        if (this.isAdmin) {
          this.router.navigate(['admin/all-dealers']);
        } else {
          this.router.navigate(['']);
        }
      }
    }, (err) => {
      this.isLoading = false;
    });
  }

}
