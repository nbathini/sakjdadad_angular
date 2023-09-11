import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSectionListComponent } from './tab-section-list.component';

describe('TabSectionListComponent', () => {
  let component: TabSectionListComponent;
  let fixture: ComponentFixture<TabSectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabSectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabSectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
