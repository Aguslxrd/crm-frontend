import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnterprisesService } from '../../services/enterprises.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-enterprise-form-modal',
  templateUrl: './edit-enterprise-form-modal.component.html',
  styleUrl: './edit-enterprise-form-modal.component.css'
})
export class EditEnterpriseFormModalComponent implements OnInit {
  enterpriseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditEnterpriseFormModalComponent>,
    private enterpriseService: EnterprisesService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { 
      enterpriseId: number, 
      name_enterprise : string,
      rut: string,
      address: string,
      phone: string,
      email: string,
      web_site: string
    } 

  ) {
    this.enterpriseForm = this.fb.group({
      enterpriseId: [this.data.enterpriseId],
      name_enterprise: [this.data.name_enterprise, Validators.required],
      rut: [this.data.rut, Validators.required],
      address: [this.data.address, Validators.required],
      phone: [this.data.phone, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      web_site: [this.data.web_site]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.enterpriseForm.valid) {
      this.enterpriseService.saveEnterprise(this.enterpriseForm.value).subscribe(
        (response) => {
          this.toastr.success('Empresa actualizado correctamente!', 'ArcticCRM');
          this.dialogRef.close(); 
        },
        (error) => {
          this.toastr.error('Error al actualizar la empresa!', 'ArcticCRM');
        }
      );
    }
  }
}