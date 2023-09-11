import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTabSectionComponent } from './add-tab-section.component';

describe('AddTabSectionComponent', () => {
  let component: AddTabSectionComponent;
  let fixture: ComponentFixture<AddTabSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTabSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTabSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
