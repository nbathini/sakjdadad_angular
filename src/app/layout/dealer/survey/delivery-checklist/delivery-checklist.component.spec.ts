import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryChecklistComponent } from './delivery-checklist.component';

describe('DeliveryChecklistComponent', () => {
  let component: DeliveryChecklistComponent;
  let fixture: ComponentFixture<DeliveryChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
