import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCarModelComponent } from './create-car-model.component';

describe('CreateCarModelComponent', () => {
  let component: CreateCarModelComponent;
  let fixture: ComponentFixture<CreateCarModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCarModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCarModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
