import { Component, OnInit } from '@angular/core';
import { CaseInterface } from '../../interfaces/ICase';
import { MatDialog } from '@angular/material/dialog';
import { NewCaseFormModalComponent } from '../new-case-form-modal/new-case-form-modal.component';
import { EditCaseFormModalComponent } from '../edit-case-form-modal/edit-case-form-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CasesService } from '../../services/cases.service';

@Component({
  selector: 'app-cases-list',
  templateUrl: './cases-list.component.html',
  styleUrls: ['./cases-list.component.css']
})
export class CaseListComponent implements OnInit {
  cases: CaseInterface[] = [];
  searchCriteria: string = 'title';
  searchQuery: string = '';

  constructor(private caseService: CasesService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadCases();
    this.route.params.subscribe(params => {
      const caseId = +params['caseId'];
    });
  }

  loadCases(): void {
    this.caseService.getOpenAndInProgressCases().subscribe(
      (response) => {
        this.cases = response;
      },
      (error) => {
        console.error('Error fetching cases:', error);
      }
    );
  }

  searchCases(): void {
    if (this.searchQuery.trim() === '') {
      this.loadCases();
      return;
    }

    switch (this.searchCriteria) {
      case 'caseId':
        const caseId = parseInt(this.searchQuery, 10);
        if (!isNaN(caseId)) {
          this.caseService.getCaseOpenedAndInProgressById(caseId).subscribe(
            (response) => {
              this.cases = Array.isArray(response) ? response : [response];
            },
            (error) => {
              console.error('Error searching cases by case ID:', error);
              this.cases = [];
            }
          );
        } else {
          console.error('Invalid case ID');
          this.cases = [];
        }
        break;
      default:
        console.error('Invalid search criteria:', this.searchCriteria);
        this.cases = [];
        break;
    }
  }

  editCase(caseItem: CaseInterface): void {
    const dialogRef = this.dialog.open(EditCaseFormModalComponent, {
      width: '400px',
      data: caseItem
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Case Edited:', result);
      }
      this.loadCases();
    });
  }

  viewCaseDetails(caseId: number) {
    console.log('View case details called with ID:', caseId);
    if (caseId === undefined || caseId === null) {
      console.error('Invalid caseId:', caseId);
      return;
    }
    this.router.navigate(['/details/cases', caseId]);
  }
}