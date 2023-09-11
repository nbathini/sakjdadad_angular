import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ChangePasswordComponent } from './change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the onSubmit method', async () => {
    component.onSubmit();
    expect(component.isSubmitted).toBeTruthy();
  });

  it('form should be invalid', async () => {
    component.changePasswordForm.controls.oldPassword.setValue('');
    component.changePasswordForm.controls.password.setValue('');
    component.changePasswordForm.controls.confirmPassword.setValue('');
    expect(component.changePasswordForm.valid).toBeFalsy();
  });

  it('form should be valid', async () => {
    component.changePasswordForm.controls.oldPassword.setValue('Test@123');
    component.changePasswordForm.controls.password.setValue('Test@1234');
    component.changePasswordForm.controls.confirmPassword.setValue('Test@1234');

    expect(component.changePasswordForm.valid).toBeTruthy();
  });
});
