import { Component, OnInit } from '@angular/core';
import { InteractionInterface } from '../../interfaces/IInteraction';
import { InteractionsService } from '../../services/interactions.service';
import { StorageService } from '../../services/storage-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    private router: Router,
    private toastr: ToastrService
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
          this.toastr.warning('No se encontraron interaciones', 'ArcticCRM');
          this.isLoading = false;
        }
      });
    } else {
      this.toastr.error('Error, no se encontro tu perfil, recarga la web', 'ArcticCRM');
      this.isLoading = false;
    }
  }

  goToCase(caseId: number): void {
    this.router.navigate(['/details/cases/', caseId]);
  }
}
