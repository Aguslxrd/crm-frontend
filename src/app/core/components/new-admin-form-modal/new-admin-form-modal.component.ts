import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewCaseFormModalComponent } from '../new-case-form-modal/new-case-form-modal.component';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-new-admin-form-modal',
  templateUrl: './new-admin-form-modal.component.html',
  styleUrl: './new-admin-form-modal.component.css'
})
export class NewAdminFormModalComponent implements OnInit {
  adminForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewCaseFormModalComponent>,
    private adminService: AdminService,
    private toastr: ToastrService,
  ) {
    this.adminForm = this.fb.group({
      email: ['', Validators.required],
      adminname: ['', Validators.required],
      passwd: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.adminForm.valid) {
      this.adminService.saveAdminData(this.adminForm.value).subscribe(
        (response) => {
          this.toastr.success('Administrador creado correctamente con el nombre!', 'ArcticCRM');
          this.dialogRef.close(); 
        },
        (error) => {
          this.toastr.error('Error al crear administrador!', 'ArcticCRM');
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}