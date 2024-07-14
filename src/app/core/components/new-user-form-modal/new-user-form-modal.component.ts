import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-form-modal',
  templateUrl: './new-user-form-modal.component.html',
  styleUrls: ['./new-user-form-modal.component.css']
})
export class NewUserFormModalComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewUserFormModalComponent>
  ) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      secondname: [''],
      firstlastname: ['', Validators.required],
      secondlastname: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      identifier: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
