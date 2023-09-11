import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCheckPointComponent } from './add-check-point.component';

describe('AddCheckPointComponent', () => {
  let component: AddCheckPointComponent;
  let fixture: ComponentFixture<AddCheckPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCheckPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCheckPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
