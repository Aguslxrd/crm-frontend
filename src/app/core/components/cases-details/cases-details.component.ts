import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseInterface } from '../../interfaces/ICase';
import { InteractionInterface } from '../../interfaces/IInteraction';
import { CasesService } from '../../services/cases.service';
import { InteractionsService } from '../../services/interactions.service';
import { EditInteractionFormModalComponent } from '../edit-interaction-form-modal/edit-interaction-form-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NewInteractionFormModalComponent } from '../new-interaction-form-modal/new-interaction-form-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cases-details',
  templateUrl: './cases-details.component.html',
  styleUrls: ['./cases-details.component.css']
})
export class CaseDetailsComponent implements OnInit {
  caseDetails: any | null = null;
  interactions: InteractionInterface[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private caseService: CasesService,
    private dialog: MatDialog,
    private interactionService: InteractionsService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const caseId = +params['caseId'];
      this.loadCaseDetails(caseId);
      this.loadInteractions(caseId);
    });
  }
  
  loadCaseDetails(caseId: number): void {
    this.loading = true;
    this.caseService.getCaseById(caseId).subscribe(
      (caseData) => {
        this.caseDetails = caseData;
        this.loading = false;
      },
      (error) => {
        this.toastrService.error("Error al cargar detalles del caso! ", "ArcticCRM");
        this.loading = false;
      }
    );
  }


loadInteractions(caseId: number): void {
  this.interactionService.getInteractionsByCaseId(caseId).subscribe(
    (interactions) => {
      this.interactions = interactions;
    },
    (error) => {
      if (error.status === 404) {
        this.interactions = [];
      } else {
        this.toastrService.error("Error al cargar detalles del caso! ", "ArcticCRM");
      }
    }
  );
}

  openAddInteractionModal(): void {
    if (!this.caseDetails) return;

    const dialogRef = this.dialog.open(NewInteractionFormModalComponent, {
      width: '400px',
      data: { 
        authId: localStorage.getItem('userId'), 
        caseId: this.caseDetails.caseId 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInteractions(this.caseDetails.caseId);
      }
    });
  }

  openEditInteractionModal(interaction: InteractionInterface): void {
    if (!this.caseDetails) return;

    const dialogRef = this.dialog.open(EditInteractionFormModalComponent, {
      width: '400px',
      data: { 
        interactionId: interaction.interactionId, 
        caseId: this.caseDetails.caseId 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInteractions(this.caseDetails?.caseId);
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
