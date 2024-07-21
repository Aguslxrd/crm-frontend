import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CaseInterface } from '../../interfaces/ICase';
import { CasesService } from '../../services/cases.service';
import { InteractionInterface } from '../../interfaces/IInteraction';
import { InteractionsService } from '../../services/interactions.service';
import { NewCaseFormModalComponent } from '../new-case-form-modal/new-case-form-modal.component';
import { StorageService } from '../../services/storage-service.service';
import { NewInteractionFormModalComponent } from '../new-interaction-form-modal/new-interaction-form-modal.component';

@Component({
  selector: 'app-user-cases',
  templateUrl: './user-cases.component.html',
  styleUrls: ['./user-cases.component.css']
})
export class UserCasesComponent implements OnInit {
  case: CaseInterface | null = null;
  interactions: InteractionInterface[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private casesService: CasesService,
    private interactionService: InteractionsService,
    private dialog: MatDialog,
    private localStorage: StorageService
  ) { }

  ngOnInit(): void {
    const caseId = this.route.snapshot.paramMap.get('caseId');
    if (caseId) {
      this.loadCaseDetails(parseInt(caseId, 10));
      this.loadInteractions(parseInt(caseId, 10));
    }
  }

  loadCaseDetails(caseId: number): void {
    console.log('Fetching case details for caseId:', caseId);
    this.casesService.getCaseById(caseId).subscribe(
      (caseData) => {
        console.log('Received case data:', caseData);
        if (caseData) {
          this.case = caseData;
        } else {
          console.error('No case data returned');
          this.case = null;
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching case details:', error);
        this.case = null;
        this.loading = false;
      }
    );
  }

  loadInteractions(caseId: number): void {
    console.log('Fetching interactions for caseId:', caseId);
    this.interactionService.getInteractionsByCaseId(caseId).subscribe(
      (interactions) => {
        console.log('Received interactions data:', interactions);
        this.interactions = interactions;
      },
      (error) => {
        console.error('Error fetching interactions:', error);
      }
    );
  }

  editInteraction(interaction: InteractionInterface): void {
    console.log('Edit interaction');
  }

  addInteraction(): void {
    const dialogRef = this.dialog.open(NewInteractionFormModalComponent, {
      width: '400px',
      data: { authId: this.localStorage.getUserId(),
        caseId: this.case?.caseId
       } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Case saved:', result);
      }
    });
  }

}