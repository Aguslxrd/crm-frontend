import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InteractionsService } from '../../services/interactions.service';
import { StorageService } from '../../services/storage-service.service';

@Component({
  selector: 'app-edit-interaction-form-modal',
  templateUrl: './edit-interaction-form-modal.component.html',
  styleUrl: './edit-interaction-form-modal.component.css'
})
export class EditInteractionFormModalComponent implements OnInit{interactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditInteractionFormModalComponent>,
    private interactionService: InteractionsService,
    private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { caseId: number, userId: number, interactionId: number } 
  ) {
    this.interactionForm = this.fb.group({
      //interactionId: [data.InteractionId, Validators.required],
      caseId: [data.caseId, Validators.required],
      authId: [storageService.getUserId, Validators.required], 
      title: ['', Validators.required],
      description_case: ['', Validators.required],
      case_status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInteractionDetails();
  }

  loadInteractionDetails(): void {
    this.interactionService.getInteractionById(this.interactionForm.value.caseId).subscribe(caseData => {
      this.interactionForm.patchValue(caseData);
    });
  }

  onSubmit(): void {
    if (this.interactionForm.valid) {
      console.log('Submitting interaction form with:', this.interactionForm.value);
      this.interactionService.saveInteraction(this.interactionForm.value).subscribe(
        response => {
          console.log('Case updated successfully:', response);
          this.dialogRef.close(response); 
        },
        error => {
          console.error('Error updating case:', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(); 
  }
}
