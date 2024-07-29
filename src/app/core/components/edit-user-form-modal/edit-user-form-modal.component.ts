import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { UserInterface } from '../../interfaces/IUser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user-form-modal',
  templateUrl: './edit-user-form-modal.component.html',
  styleUrl: './edit-user-form-modal.component.css'
})
export class EditUserFormModalComponent implements OnInit {
  userForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<EditUserFormModalComponent>,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: UserInterface
  ) {
    this.userForm = this.fb.group({
      userid: [this.data.userid, Validators.required],
      firstname: [this.data.firstname, Validators.required],
      secondname: [this.data.secondname],
      firstlastname: [this.data.firstlastname, Validators.required],
      secondlastname: [this.data.secondlastname],
      phone: [this.data.phone, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      address: [this.data.address],
      identifier: [this.data.identifier, Validators.required],
      user_status: ['', Validators.required]
    });
  }
  

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userid: [this.data.userid, Validators.required],
      firstname: [this.data.firstname, Validators.required],
      secondname: [this.data.secondname],
      firstlastname: [this.data.firstlastname, Validators.required],
      secondlastname: [this.data.secondlastname],
      phone: [this.data.phone, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      address: [this.data.address],
      identifier: [this.data.identifier, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.saveUser(this.userForm.value).subscribe(
        (updatedUser) => {
          this.toastr.success('Usuario actualizado correctamente!', 'ArcticCRM');
          this.dialogRef.close(updatedUser);
        },
        (error) => {
          this.toastr.error('Error al actualizar usuario, revisa los datos ingresados!', 'ArcticCRM');
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}