import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EnterprisesService } from '../../services/enterprises.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-enterprise-form-modal',
  templateUrl: './new-enterprise-form-modal.component.html',
  styleUrl: './new-enterprise-form-modal.component.css'
})
export class NewEnterpriseFormModalComponent implements OnInit {
  enterpriseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewEnterpriseFormModalComponent>,
    private enterpriseService: EnterprisesService,
    private toastr: ToastrService,
  ) {
    this.enterpriseForm = this.fb.group({
      name_enterprise: ['', Validators.required],
      rut: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      web_site: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.enterpriseForm.valid) {
      this.enterpriseService.saveEnterprise(this.enterpriseForm.value).subscribe(
        (response) => {
          this.toastr.success('Empresa creada correctamente!', 'ArcticCRM');
          this.dialogRef.close(); 
        },
        (error) => {
          this.toastr.error('Error al crear empresa!', 'ArcticCRM');
        }
      );
    }
  }
}