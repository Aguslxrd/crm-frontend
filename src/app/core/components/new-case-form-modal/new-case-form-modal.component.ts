import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewUserFormModalComponent } from '../new-user-form-modal/new-user-form-modal.component';
import { CasesService } from '../../services/cases.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../services/storage-service.service';

@Component({
  selector: 'app-new-case-form-modal',
  templateUrl: './new-case-form-modal.component.html',
  styleUrl: './new-case-form-modal.component.css'
})
export class NewCaseFormModalComponent implements OnInit {
  caseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewCaseFormModalComponent>,
    private caseService: CasesService,
    private toastr: ToastrService,
    private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {
    this.caseForm = this.fb.group({
      userId: [data.userId, Validators.required],
      authId: [storageService.getUserId()],
      title: ['', Validators.required],
      description_case: ['', Validators.required],
      case_status: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.caseForm.valid) {
      this.caseService.saveCase(this.caseForm.value).subscribe(
        (response) => {
          this.toastr.success('Caso creado correctamente!', 'ArcticCRM');
          this.dialogRef.close(); 
        },
        (error) => {
          this.toastr.error('Error al crear usuario!', 'ArcticCRM');
        }
      );
    }
  }
}
