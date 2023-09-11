import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { DeliveryComponent } from './delivery.component';

describe('DeliveryComponent', () => {
  let component: DeliveryComponent;
  let fixture: ComponentFixture<DeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryComponent],
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
    fixture = TestBed.createComponent(DeliveryComponent);
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
    component.deliveryForm.controls.customerName.setValue('');
    component.deliveryForm.controls.customerEmail.setValue('');
    component.deliveryForm.controls.model.setValue('');
    component.deliveryForm.controls.deliveryDate.setValue('');
    component.deliveryForm.controls.deliveryTime.setValue('');
    component.deliveryForm.controls.contactNumber.setValue('');
    component.deliveryForm.controls.porschePro.setValue('');
    component.deliveryForm.controls.salesConsultant.setValue('');
    component.deliveryForm.controls.serviceAdvisor.setValue('');
    expect(component.deliveryForm.valid).toBeFalsy();
  });

  it('form should be valid', async () => {
    component.deliveryForm.controls.customerEmail.setValue('test@email.com');
    component.deliveryForm.controls.model.setValue('{id:1,name:"Tycan Turbo"}');
    component.deliveryForm.controls.deliveryDate.setValue('02/02/2021');
    component.deliveryForm.controls.deliveryTime.setValue('04:00 AM');
    component.deliveryForm.controls.contactNumber.setValue('+1 222 5559 698');
    component.deliveryForm.controls.porschePro.setValue('Harry');
    component.deliveryForm.controls.salesConsultant.setValue('Smith');
    component.deliveryForm.controls.serviceAdvisor.setValue('Laura');

    expect(component.deliveryForm.valid).toBeTruthy();
  });
});
