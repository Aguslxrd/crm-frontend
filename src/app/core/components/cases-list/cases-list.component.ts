import { Component, OnInit } from '@angular/core';
import { CaseInterface } from '../../interfaces/ICase';
import { MatDialog } from '@angular/material/dialog';
import { NewCaseFormModalComponent } from '../new-case-form-modal/new-case-form-modal.component';
import { EditCaseFormModalComponent } from '../edit-case-form-modal/edit-case-form-modal.component';
import { Router } from '@angular/router';
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

  constructor(private caseService: CasesService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.loadCases();
  }

  loadCases(): void {
    this.caseService.getCases().subscribe(
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
          this.caseService.getCaseById(caseId).subscribe(
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

  openSaveCaseModal(): void {
    const dialogRef = this.dialog.open(NewCaseFormModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Case saved:', result);
        this.loadCases();
      }
    });
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

  deleteCase(caseId: number): void {
    this.caseService.deleteCaseById(caseId).subscribe(
      () => this.loadCases()
    );
  }

  viewCaseDetails(caseId: number) {
    this.router.navigate(['/case/details', caseId]);
  }
}