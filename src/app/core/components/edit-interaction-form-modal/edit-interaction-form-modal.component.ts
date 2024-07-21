import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InteractionsService } from '../../services/interactions.service';
import { StorageService } from '../../services/storage-service.service';

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
    console.log('Initializing EditInteractionFormModalComponent with data:', this.data);
    this.loadInteractionDetails();
  }

  loadInteractionDetails(): void {
    this.interactionService.getInteractionById(this.data.interactionId).subscribe(
      interactionData => {
        console.log('Loaded interaction data:', interactionData);
        this.interactionForm.patchValue(interactionData);
      },
      error => {
        console.error('Error loading interaction details:', error);
      }
    );
  }
  
  

  onSubmit(): void {
    if (this.interactionForm.valid) {
      console.log('Submitting interaction form with:', this.interactionForm.value);
      this.interactionService.saveInteraction(this.interactionForm.value).subscribe(
        response => {
          console.log('Interaction updated successfully:', response);
          this.dialogRef.close(response); 
        },
        error => {
          console.error('Error updating interaction:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  
  

  onCancel(): void {
    this.dialogRef.close(); 
  }
}
