import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionChangeEvent } from '@porsche-design-system/components-angular';
import * as moment from 'moment';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { CustomerDelivery } from 'src/app/shared/models/delivery.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-manage-doc-config',
  templateUrl: './manage-doc-config.component.html',
  styleUrls: ['./manage-doc-config.component.scss']
})

export class ManageDocConfigComponent implements OnInit {
  panelOpenState = false;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  configForm = new FormGroup({});
  isSubmitted = false;
  isLoading = false;
  deliveryId: any;
  advisors: Array<User> = [];

  tabsArray: Array<any> = [];
  sectionsArray: Array<any> = [];
  subSectionsArray: Array<any> = [];
  checklistArray: Array<any> = [];
  deliverData: any;
  consultants: Array<User> = [];
  docJson: any;
  tabs = [
    {
      heading: 'Tab 1 Heading',
      isOpen: false,
      content:
        'Content for Tab 1. Lorem ipsum dolor sit amet, consetetur sadipscing elitr...',
    },
    {
      heading: 'Tab 2 Heading',
      isOpen: false,
      content:
        'Content for Tab 2. At vero eos et accusam et justo duo dolores et ea rebum.',
    },
    // Add more tabs as needed
  ];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private http: HttpService
  ) {
    this.createconfigForm();
  }

  ngOnInit(): void {
    this.getDocuments();
  }
  /*** Get CheckList Documents ***/
  getDocuments(): void {
    this.http.getData(ApiUrl.admin.getDocuments).subscribe((response) => {
      if (!!response) {
        this.docJson = response.result ? JSON.parse(response.result) : [];
        console.log("docJson", this.docJson);
        this.docJson.forEach((tabELe: any, tindex: number) => {
          if (tindex !== 0) this.addTabItem();
          tabELe.Fields.forEach((fieldEle: any, fIndex: number) => {
            if (fIndex !== 0) this.addSectionItem(tindex);
            fieldEle.Questions.forEach((quesEle: any, qIndex: number) => {
              if (qIndex !== 0) this.addCheckItem(tindex, fIndex);
            })
          })
        })
        setTimeout(() => {
          this.configForm.patchValue({
            tabsList: this.docJson
          })
        }, 100)
      }
    });
  }
  get dForm(): any {
    return this.configForm.controls;
  }
  trim(key: string): void {
    this.configForm.controls[key].patchValue(this.dForm[key].value.trim());
  }

  createconfigForm(): void {
    this.configForm = this.formBuilder.group({
      tabsList: this.formBuilder.array([this.createTab()]),
    });

  }
  openAll() {
    let tab = this.getTablist();
    tab.controls.forEach((ele) => {
      ele.patchValue({
        isOpen: true
      })
    })
  }
  closeAll() {
    let tab = this.getTablist();
    tab.controls.forEach((ele) => {
      ele.patchValue({
        isOpen: false
      })
    })
  }
  getTablist() {
    return this.configForm.get('tabsList') as FormArray;
  }
  getFields(index: any) {
    let tab = this.getTablist();
    return tab.controls[index].get('Fields') as FormArray;
  }
  getChecklist(index: any, index2: any) {
    let tab = this.getFields(index);
    return tab.controls[index2].get('Questions') as FormArray;
  }
  addTabItem(check?: boolean) {
    if (check) {
      this.isSubmitted = true;
      if (!this.configForm.valid) {
        setTimeout(() => {
          this.isSubmitted = false;
        }, 20000);
        return;
      }
    }
    const checkArray = this.getTablist();
    checkArray.push(this.createTab());
  }
  removeTab(i: number) {
    const checkArray = this.getTablist();
    checkArray.removeAt(i);
  }
  addSectionItem(i: any, check?: boolean) {
    if (check) {
      this.isSubmitted = true;
      if (!this.configForm.valid) {
        setTimeout(() => {
          this.isSubmitted = false;
        }, 20000);
        return;
      }
    }
    const checkArray = this.getFields(i);
    checkArray.push(this.createSection());
  }
  removeSection(i: any, j: any) {
    const checkArray = this.getFields(i);
    checkArray.removeAt(j);
  }
  addCheckItem(i: any, j: any, check?: boolean) {
    if (check) {
      this.isSubmitted = true;
      if (!this.configForm.valid) {
        setTimeout(() => {
          this.isSubmitted = false;
        }, 20000);
        return;
      }
    }
    const checkArray = this.getChecklist(i, j);
    checkArray.push(this.createCheck());
  }
  removeCheckItem(i: any, j: any, k: any) {
    const checkArray = this.getChecklist(i, j);
    checkArray.removeAt(k);
  }
  createCheck() {
    return this.formBuilder.group({
      Label: [''],
      Name: [''],
      Answer: [null],
      Type: ['checkbox'],
      MoveToFollowUp: [false],
      Links: [[]],
      Documents: [[]],
      IsRequired: [true],
      IsAddLink: [true],
      IsAddDoc: [true],
    })
  }
  createTab() {
    return this.formBuilder.group({
      Label: [''],
      AllocatedTime: [''],
      Info: [''],
      Name: [''],
      isOpen: [false],
      Questions: [null],
      Fields: this.formBuilder.array([this.createSection()]),
    })
  }
  createSection() {
    return this.formBuilder.group({
      Label: [''],
      Name: [''],
      Answer: [null],
      Type: [null],
      Questions: this.formBuilder.array([this.createCheck()]),
      //  subFields: this.formBuilder.array([this.createSubSection()]),
    })
  }
  createSubSection() {
    return this.formBuilder.group({
      subSectionName: ['', Validators.required],
      Questions: this.formBuilder.array([this.createCheck()]),
    })
  }
  checkValid() {
    this.isSubmitted = true;
    if (!this.configForm.valid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 20000);
      return;
    }
  }
  /*** Submit Form ***/
  onSubmit(): void {
    this.isSubmitted = true;
    if (!this.configForm.valid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 20000);
      return;
    }
    const submitData = this.configForm.value;
    submitData.tabsList.forEach((element: any, tindex: number) => {
      element.Name = element.Name ? element.Name : 'tab_' + element.Label.replace(/\s+/g, '').substring(0, 3) + '_' + tindex;
      element.Fields.forEach((fieldElement: any, fIndex: number) => {
        fieldElement.Name = fieldElement.Name ? fieldElement.Name : 'sec_' + fieldElement.Label.replace(/\s+/g, '').substring(0, 3) + '_' + fIndex;
        fieldElement.Questions.forEach((questionElement: any, index: number) => {
          questionElement.Name = questionElement.Name ? questionElement.Name : 'qest_' + questionElement.Label.replace(/\s+/g, '').substring(0, 3) + '_' + index;
        })
      })
    });

    this.isLoading = true;
    this.http.postData(ApiUrl.admin.managechecklist, submitData.tabsList).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        this.message.toast('success', response.message);
        this.configForm.reset();
        this.isSubmitted = false;
        this.router.navigate(['/admin/manage-documents']);
      }
    }, (err) => {
      this.isLoading = false;
    });

  }
  onAccordionChange(e: CustomEvent<AccordionChangeEvent>, tabIndex: number) {
    //    this.tabs[tabIndex].isOpen = e.detail.open;
    let tab = this.getTablist();
    return tab.controls[tabIndex].patchValue({
      isOpen: e.detail.open
    })
  }
} 
