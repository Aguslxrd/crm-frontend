import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CasesService } from '../../services/cases.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../services/storage-service.service';

@Component({
  selector: 'app-edit-case-form-modal',
  templateUrl: './edit-case-form-modal.component.html',
  styleUrls: ['./edit-case-form-modal.component.css']
})
export class EditCaseFormModalComponent implements OnInit {
  caseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditCaseFormModalComponent>,
    private caseService: CasesService,
    private toastr: ToastrService,
    private localStorage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { caseId: number, userId: number } 
  ) {
    this.caseForm = this.fb.group({
      caseId: [data.caseId, Validators.required],
      userId: [data.userId, Validators.required],
      authId: [localStorage.getUserId()], 
      title: ['', Validators.required],
      description_case: ['', Validators.required],
      case_status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCaseDetails();
  }

  loadCaseDetails(): void {
    this.caseService.getCaseById(this.caseForm.value.caseId).subscribe(caseData => {
      this.caseForm.patchValue(caseData);
    });
  }

  onSubmit(): void {
    if (this.caseForm.valid) {
      this.caseService.saveCase(this.caseForm.value).subscribe(
        response => {
          this.toastr.success('Caso actualizado correctamente!', 'ArcticCRM');
          this.dialogRef.close(response); 
        },
        error => {
          this.toastr.error('Error al actualizar caso, revisa los datos ingresados!', 'ArcticCRM');
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(); 
  }
}
