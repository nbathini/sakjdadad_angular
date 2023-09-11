import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryTypePopupComponent } from './delivery-type-popup.component';

describe('DeliveryTypePopupComponent', () => {
  let component: DeliveryTypePopupComponent;
  let fixture: ComponentFixture<DeliveryTypePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryTypePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryTypePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
