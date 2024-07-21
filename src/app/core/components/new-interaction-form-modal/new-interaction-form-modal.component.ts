import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InteractionsService } from '../../services/interactions.service';

@Component({
  selector: 'app-new-interaction-form-modal',
  templateUrl: './new-interaction-form-modal.component.html',
  styleUrls: ['./new-interaction-form-modal.component.css']
})
export class NewInteractionFormModalComponent {
  interactionForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewInteractionFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { caseId: number, authId: number },
    private fb: FormBuilder,
    private interactionService: InteractionsService
  ) {

    this.interactionForm = this.fb.group({
      authId: [data.authId, Validators.required],
      caseId: [data.caseId, Validators.required],
      interaction_text: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.interactionForm.valid) {
      this.interactionService.saveInteraction(this.interactionForm.value).subscribe(
        (response) => {
          console.log('Interaction saved successfully:', response);
          this.dialogRef.close(); 
        },
        (error) => {
          console.error('Error saving interaction:', error);
        }
      );
    }
  }
  
}
