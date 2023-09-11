import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm = new FormGroup({});
  isSubmitted = false;
  isLoading = false;
  isAdmin = false;
  setPassword = false;
  token: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private message: MessageService,
    private http: HttpService
  ) {
    this.route.queryParams.subscribe(params => {
      this.token = params.token;
    });
    this.createResetForm();
  }

  ngOnInit(): void {
    if (this.router.url.includes('/admin')) {
      this.isAdmin = true;
    }
    if (this.router.url.includes('/set-password')) {
      this.setPassword = true;
    }
  }

  /*** Intialize Form ***/
  createResetForm(): void {
    const pattern1 = new RegExp(/^(?=.*\d)(?=.*[A-Z]).{6,15}$/);
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(pattern1)]],
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
    if (!this.resetForm.valid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 20000);
      return;
    }
    const params = {
      password: this.resetForm.controls.password.value,
      token: this.token
    };
    const url = this.isAdmin ? ApiUrl.admin.resetPassword : ApiUrl.auth.resetPassword;
    this.isLoading = true;
    this.http.postData(url, params).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        this.message.toast('success', response.message);
        if (this.isAdmin) {
          this.router.navigate(['/admin/login']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    }, (err) => {
      this.isLoading = false;
    });
  }

  /*** Redirect to Login page ***/
  backToLogin(): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin/login']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
