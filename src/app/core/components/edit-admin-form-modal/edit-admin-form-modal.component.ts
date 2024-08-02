import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-edit-admin-form-modal',
  templateUrl: './edit-admin-form-modal.component.html',
  styleUrls: ['./edit-admin-form-modal.component.css']
})
export class EditAdminFormModalComponent implements OnInit {
  adminForm: FormGroup;
  hidePassword = true;
  roles: string[] = ['USER', 'SUPPORT', 'ADMIN'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditAdminFormModalComponent>,
    private adminService: AdminService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, email: string, adminName: string, passwd: string, userrole: string }
  ) {
    this.adminForm = this.fb.group({
      id: [data.id],
      email: [data.email, [Validators.required, Validators.email]],
      adminName: [data.adminName, Validators.required],
      passwd: [data.passwd, [Validators.required, Validators.minLength(8)]],
      userrole: [data.userrole, Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.adminForm.valid) {
      this.adminService.editAdmin(this.adminForm.value).subscribe(
        (response) => {
          this.toastr.success('Usuario actualizado correctamente!', 'ArcticCRM');
          this.dialogRef.close();
        },
        (error) => {
          this.toastr.error('Error al actualizar usuario!', 'ArcticCRM');
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
