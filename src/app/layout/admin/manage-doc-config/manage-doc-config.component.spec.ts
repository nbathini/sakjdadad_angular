import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDocConfigComponent } from './manage-doc-config.component';

describe('ManageDocConfigComponent', () => {
  let component: ManageDocConfigComponent;
  let fixture: ComponentFixture<ManageDocConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDocConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDocConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
