import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseInterface } from '../../interfaces/ICase';
import { InteractionInterface } from '../../interfaces/IInteraction';
import { CasesService } from '../../services/cases.service';
import { InteractionsService } from '../../services/interactions.service';

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
    private interactionService: InteractionsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const caseId = +params['caseId'];
      this.loadCaseDetails(caseId);
      this.loadInteractions(caseId);
    });
  }

  loadCaseDetails(caseId: number): void {
    this.caseService.getCaseById(caseId).subscribe(
      (caseData) => {
        this.caseDetails = caseData;
        this.loading = false;
      },
      (error) => {
        this.error = 'Error loading case details';
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
        console.error('Error loading interactions:', error);
        this.error = 'Error loading interactions';
      }
    );
  }

  goBack(): void {
    window.history.back();
  }
}