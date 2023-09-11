import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PclAuthorizationComponent } from './pcl-authorization.component';

describe('PclAuthorizationComponent', () => {
  let component: PclAuthorizationComponent;
  let fixture: ComponentFixture<PclAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PclAuthorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PclAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
