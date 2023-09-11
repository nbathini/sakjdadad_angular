import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocViewPopupComponent } from './doc-view-popup.component';

describe('DocViewPopupComponent', () => {
  let component: DocViewPopupComponent;
  let fixture: ComponentFixture<DocViewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocViewPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocViewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
