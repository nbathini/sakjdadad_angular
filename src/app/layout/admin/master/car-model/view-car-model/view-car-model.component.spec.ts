import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCarModelComponent } from './view-car-model.component';

describe('ViewCarModelComponent', () => {
  let component: ViewCarModelComponent;
  let fixture: ComponentFixture<ViewCarModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCarModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCarModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
