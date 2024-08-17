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
import { EditCaseFormModalComponent } from '../edit-case-form-modal/edit-case-form-modal.component';
import { EditInteractionFormModalComponent } from '../edit-interaction-form-modal/edit-interaction-form-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-cases',
  templateUrl: './user-cases.component.html',
  styleUrls: ['./user-cases.component.css']
})
export class UserCasesComponent implements OnInit {
  case: any | null = null;
  interactions: InteractionInterface[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private casesService: CasesService,
    private interactionService: InteractionsService,
    private dialog: MatDialog,
    private localStorage: StorageService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const caseId = this.route.snapshot.paramMap.get('caseId');
    if (caseId) {
      this.loadCaseDetails(parseInt(caseId, 10));
      this.loadInteractions(parseInt(caseId, 10));
    }
  }

  loadCaseDetails(caseId: number): void {
    this.casesService.getCaseById(caseId).subscribe(
      (caseData) => {
        if (caseData) {
          this.case = caseData;
        } else {
          this.toastr.warning('No hay detalles del caso', 'ArcticCRM');
          this.case = null;
        }
        this.loading = false;
      },
      (error) => {
        this.toastr.error('Error, no se encontro caso', 'ArcticCRM');
        this.case = null;
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
        this.toastr.warning('No se encontro interacciones', 'ArcticCRM');
      }
    );
  }

  editInteraction(interactionId: number): void {
    const dialogRef = this.dialog.open(EditInteractionFormModalComponent, {
      width: '400px',
      data: { interactionId: interactionId, caseId: this.case?.caseId }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Interaccion editada', 'ArcticCRM');
        this.loadInteractions(this.case?.caseId as number); 
      }
    });
  }
  

  addInteraction(): void {
    const dialogRef = this.dialog.open(NewInteractionFormModalComponent, {
      width: '400px',
      data: { authId: this.localStorage.getUserId(), caseId: this.case?.caseId }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Interaction added:', result);
        this.loadInteractions(this.case?.caseId as number);
      }
    });
  }
}
