import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCheckPointComponent } from './add-check-point/add-check-point.component';
import { AddTabSectionComponent } from './add-tab-section/add-tab-section.component';
import { CheckListComponent } from './check-list/check-list.component';
import { ManageDocConfigComponent } from './manage-doc-config.component';
import { TabSectionListComponent } from './tab-section-list/tab-section-list.component';

const routes: Routes = [
  {
    path: '',
    component: ManageDocConfigComponent
  },
  {
    path: 'add-section-tab',
    component: AddTabSectionComponent
  },
  {
    path: 'edit-section-tab/:id',
    component: AddTabSectionComponent
  },
  {
    path: 'section-tab-list',
    component: TabSectionListComponent
  },
  {
    path: 'add-check',
    component: AddCheckPointComponent
  },
  {
    path: 'check-list',
    component: CheckListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageDocConfigRoutingModule { }
