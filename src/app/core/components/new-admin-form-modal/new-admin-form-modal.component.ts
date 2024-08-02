import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-new-admin-form-modal',
  templateUrl: './new-admin-form-modal.component.html',
  styleUrls: ['./new-admin-form-modal.component.css']
})
export class NewAdminFormModalComponent implements OnInit {
  adminForm: FormGroup;
  hidePassword = true;
  roles: string[] = ['USER', 'SUPPORT', 'ADMIN'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewAdminFormModalComponent>,
    private adminService: AdminService,
    private toastr: ToastrService,
  ) {
    this.adminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      adminname: ['', Validators.required],
      passwd: ['', [Validators.required, Validators.minLength(8)]],
      adminRole: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.adminForm.valid) {
      this.adminService.saveAdminData(this.adminForm.value).subscribe(
        (response) => {
          this.toastr.success('Usuario creado correctamente!', 'ArcticCRM');
          console.log(response);
          
          this.dialogRef.close();
        },
        (error) => {
          this.toastr.error('Error al crear usuario!', 'ArcticCRM');
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
