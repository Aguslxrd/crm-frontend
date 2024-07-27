import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InteractionsService } from '../../services/interactions.service';
import { StorageService } from '../../services/storage-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-interaction-form-modal',
  templateUrl: './edit-interaction-form-modal.component.html',
  styleUrls: ['./edit-interaction-form-modal.component.css']
})
export class EditInteractionFormModalComponent implements OnInit {
  interactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditInteractionFormModalComponent>,
    private interactionService: InteractionsService,
    private storageService: StorageService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { interactionId: number, caseId: number }
  ) {
    this.interactionForm = this.fb.group({
      interactionId: [data.interactionId, Validators.required],
      caseId: [data.caseId, Validators.required],
      authId: [storageService.getUserId(), Validators.required],
      interaction_text: ['', Validators.required],
      interaction_date: ['', Validators.required]
    });
    
  }

  ngOnInit(): void {
    this.loadInteractionDetails();
  }

  loadInteractionDetails(): void {
    this.interactionService.getInteractionById(this.data.interactionId).subscribe(
      interactionData => {
        this.interactionForm.patchValue(interactionData);
      },
      error => {
        this.toastr.warning('Error al cargar los datos de interaccion!', 'ArcticCRM');
      }
    );
  }
  
  

  onSubmit(): void {
    if (this.interactionForm.valid) {
      this.interactionService.saveInteraction(this.interactionForm.value).subscribe(
        response => {
          this.toastr.success('Interaccion actualizada correctamente!', 'ArcticCRM');
          this.dialogRef.close(response); 
        },
        error => {
          this.toastr.success('Error al actualizar interaccion, contacta un administrador!', 'ArcticCRM');
        }
      );
    } else {
      this.toastr.warning('Error al actualizar interaccion, revisa los datos ingresados!', 'ArcticCRM');
    }
  }
  
  

  onCancel(): void {
    this.dialogRef.close(null); 
  }
}
