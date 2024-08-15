import { Component, OnInit } from '@angular/core';
import { InteractionInterface } from '../../interfaces/IInteraction';
import { InteractionsService } from '../../services/interactions.service';
import { StorageService } from '../../services/storage-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interactions-list',
  templateUrl: './interactions-list.component.html',
  styleUrls: ['./interactions-list.component.css']
})
export class InteractionsListComponent implements OnInit {
  interactions: InteractionInterface[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private interactionsService: InteractionsService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInteractions();
  }

  private loadUserInteractions(): void {
    const authId = this.storageService.getUserId();

    if (authId) {
      this.interactionsService.getAllUserInteractionsByAuthId(authId).subscribe({
        next: (data: InteractionInterface[]) => {
          this.interactions = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading interactions', error);
          this.errorMessage = 'Failed to load interactions. Please try again later.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'No user ID found. Please log in.';
      this.isLoading = false;
    }
  }

  goToCase(caseId: number): void {
    this.router.navigate(['/details/cases/', caseId]);
  }
}
