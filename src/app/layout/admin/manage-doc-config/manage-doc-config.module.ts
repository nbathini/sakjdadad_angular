import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageDocConfigRoutingModule } from './manage-doc-config-routing.module';
import { ManageDocConfigComponent } from './manage-doc-config.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddTabSectionComponent } from './add-tab-section/add-tab-section.component';
import { AddCheckPointComponent } from './add-check-point/add-check-point.component';
import { CheckListComponent } from './check-list/check-list.component';
import { TabSectionListComponent } from './tab-section-list/tab-section-list.component';


@NgModule({
  declarations: [ManageDocConfigComponent, AddTabSectionComponent, AddCheckPointComponent, CheckListComponent, TabSectionListComponent],
  imports: [
    CommonModule,
    ManageDocConfigRoutingModule,
    SharedModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ManageDocConfigModule { }
