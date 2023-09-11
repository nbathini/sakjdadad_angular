import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/core/apiUrl';
import { HttpService } from 'src/app/services/http/http.service';
import { MessageService } from 'src/app/services/message/message.service';
import { Patterns } from 'src/app/shared/models/patterns.model';

@Component({
  selector: 'app-create-car-model',
  templateUrl: './create-car-model.component.html',
  styleUrls: ['./create-car-model.component.scss']
})
export class CreateCarModelComponent implements OnInit {
  modelId: any;
  modelForm = new FormGroup({});
  isSubmitted = false;
  isLoading = false;
  validationPattern = new Patterns();
  dealerId: any;
  fileType = ['image/png', 'image/jpeg', 'image/jpeg'];
  @ViewChild("fileInput", {static: false}) fileInput: ElementRef;
  editResult = {
    "statusCode": 200,
    "message": "Record fetched successfully",
    "result": {
      "id": 16,
      "name": "Taycan Turbo",
      "imagePath": "/assets/images/Taycan%20Turbo-survey.jpg",
      "description": "Taycan Turbo",
      "isActive": true,
      "staff": 0,
      "password": null
    }
  };
  carModelFile: any;
  imagePreview: any;
  modelData: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private http: HttpService,
    private toastr : ToastrService
  ) {
    this.createmodelForm();
  }
  ngOnInit(): void {
    this.modelId = this.route.snapshot.paramMap.get('id');
    if (this.modelId) {
      this.setConditionalValidator('imagePath',false); 
      this.getRoleDetails(); }
  }

  /*** Intialize Dealer Form ***/
  createmodelForm(): void {
    this.modelForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      imagePath: ['', [Validators.required]],
    });
  }

  setConditionalValidator(cname:any, ctype:boolean) {
    const nameControl = this.modelForm.get(cname);
    
    if (ctype) {
      nameControl?.setValidators([Validators.required]);
    } else {
      nameControl?.clearValidators();
    }
    
    nameControl?.updateValueAndValidity();
  }
  /*** Get Dealer Details ***/
  getRoleDetails(): void {
    this.isLoading = true;
    const url = ApiUrl.admin.masterData.carmodel+'/' + this.modelId;
   // this.setFormData(this.editResult.result);
    this.http.getData(url).subscribe((response) => {
      this.isLoading = false;
      if (!!response) {
        const result = response.result ? response.result : null;
        if (result) {
          this.modelData = result;
          this.setFormData(result);
        } else {
          this.message.toast('error', response.message);
          this.router.navigate(['/admin']);
        }
      }
    }, (err) => {
      this.router.navigate(['/admin']);
    });
  }

  /*** Set Default Values ***/
  setFormData(data: any): void {

    this.modelForm.controls.name.patchValue(data.name, { onlySelf: true });
    this.modelForm.controls.imagePath.patchValue(data.imagePath, { onlySelf: true });
    this.modelForm.controls.description.patchValue(data.description?data.description:'', { onlySelf: true });
  }

  /*** Trim form values ***/
  trim(key: string): void {
    this.modelForm.controls[key].patchValue(this.modelForm.controls[key].value.trim());
  }


    /********** On selection of file insert the value in documents array **********/
    onFileSelect(event: any): void { 
  
      if (event.target.files && event.target.files[0]) {
        if(event.target.files[0] && event.target.files[0].size > 5100000){
          this.toastr.warning("File Size Limit Exceeded. Maximum file size allowed is 5MB");
          this.clearImage();
          return;
        }
        for (const file of event.target.files) {
         
          const extension = file.name.split('.').pop().toLowerCase(); 
          // if (file.size / 1024 / 1024 < 5) {
            console.log("file.type",file.type,this.fileType.indexOf(file.type));
          if (this.fileType.indexOf(file.type) > -1) {
            this.carModelFile = file; 
            this.modelForm.patchValue({imagePath:file.name});
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imagePreview = e.target.result;
            };
            reader.readAsDataURL(file);
          } else {
            this.message.toast('error', 'Invalid File Format');
            this.clearImage();
            return;
          }
          // } else this.message.toast('warning', 'File Size Should Be Less Than 5 Mb');
        } 
      }
    }
    clearImage(){
      this.imagePreview = '';
      this.modelForm.patchValue({imagePath:''});
      this.fileInput.nativeElement.value = "";
      this.setConditionalValidator('imagePath',true);
    }
  /*** Submit Login Form ***/
  onSubmit(): void {
    this.isSubmitted = true;
    if (!this.modelForm.valid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 10000);
      return;
    }
    const params = { ...this.modelForm.value };
    const formData = new FormData();
    if(this.carModelFile)formData.append('files', this.carModelFile); 
     this.isLoading = true;
    if (this.modelId) {
      this.setConditionalValidator('imagePath',false);
      const reQuestpath = ApiUrl.admin.masterData.carmodel+'?Id='+this.modelId+'&carModelName='+this.modelForm.value.name+'&carImagePath='+this.modelForm.value.imagePath+'&carModelDesc='+this.modelForm.value.description;
      this.http.putData(reQuestpath, formData).subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.message.toast('success', response.message);
          this.router.navigate(['admin/master/car-model']); 
        }
      }, (err) => {
        this.isLoading = false;
      });
    } else {
      const reQuestpath = ApiUrl.admin.masterData.carmodel+'?Id=0&carModelName='+this.modelForm.value.name+'&carImagePath=&carModelDesc='+this.modelForm.value.description;
 
      this.setConditionalValidator('imagePath',true);
      this.http.postData(reQuestpath, formData).subscribe((response) => {
        this.isLoading = false;
        if (!!response) {
          this.message.toast('success', response.message);
          this.router.navigate(['admin/master/car-model']);
        }
      }, (err) => {
        this.isLoading = false;
      });
    }
  }

  /*** Navigate Back to Listing***/
  backToListing(): void { 
      this.router.navigate(['/admin/master/car-model']); 
  }



}
