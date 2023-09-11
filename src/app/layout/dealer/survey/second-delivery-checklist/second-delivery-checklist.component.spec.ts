import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondDeliveryChecklistComponent } from './second-delivery-checklist.component';

describe('SecondDeliveryChecklistComponent', () => {
  let component: SecondDeliveryChecklistComponent;
  let fixture: ComponentFixture<SecondDeliveryChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondDeliveryChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondDeliveryChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
