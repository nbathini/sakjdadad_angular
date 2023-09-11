import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  ApiUrl
} from 'src/app/core/apiUrl';
import {
  HttpService
} from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { Patterns } from 'src/app/shared/models/patterns.model';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {

  forgotForm = new FormGroup({});
  isSubmitted = false;
  isLoading = false;
  isAdmin = false;
  validationPattern = new Patterns();

  constructor(
    private formBuilder: FormBuilder,
    private message: MessageService,
    private router: Router,
    private http: HttpService
  ) {
    this.createforgotForm();
  }

  ngOnInit(): void {
    if (this.router.url.includes('/admin')) {
      this.isAdmin = true;
    }
  }

  /*** Intialize Forgot Form ***/
  createforgotForm(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.validationPattern.emailPattern)]],
    });
  }

  /*** Trim form values ***/
  trim(key: string): void {
    if (this.forgotForm.controls[key].value) { this.forgotForm.controls[key].patchValue(this.forgotForm.controls[key].value.trim()); }
  }

  /*** Submit Form ***/
  onSubmit(): void {
    this.isSubmitted = true;
    if (!this.forgotForm.valid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 10000);
      return;
    }
    const params = {
      ...this.forgotForm.value
    };
    this.isLoading = true;
    const url = this.isAdmin ? ApiUrl.admin.forgotPassword : ApiUrl.auth.forgotPassword;

    this.http.postData(url, params).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        this.message.toast('success', response.message);
        this.backToLogin();
      }
    }, (err) => {
      this.isLoading = false;
    });
  }

  /*** Redirect to Login page ***/
  backToLogin(): void {
    if (this.isAdmin) {
      this.router.navigate(['admin/login']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
