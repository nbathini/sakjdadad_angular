import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patterns } from 'src/app/shared/models/patterns.model';

@Component({
  selector: 'app-add-link-modal',
  templateUrl: './add-link-modal.component.html',
  styleUrls: ['./add-link-modal.component.scss']
})
export class AddLinkModalComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  isSubmitted = false;
  validationPattern = new Patterns();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddLinkModalComponent>,
  ) {
  }

  ngOnInit(): void {
    // Intialize Link form
    this.form = this.fb.group({
      url: ['', [Validators.required, Validators.pattern(this.validationPattern.urlPattern)]]
    });
  }

  /*** Add Link ***/
  onSave(): void {
    this.isSubmitted = true;
    if (!this.form.valid) {
      setTimeout(() => {
        this.isSubmitted = false;
      }, 20000);
      return;
    }
    this.dialogRef.close(this.form.value);
  }

}
