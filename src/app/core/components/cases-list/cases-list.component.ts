import { Component, OnInit } from '@angular/core';
import { CaseInterface } from '../../interfaces/ICase';
import { MatDialog } from '@angular/material/dialog';
import { NewCaseFormModalComponent } from '../new-case-form-modal/new-case-form-modal.component';
import { EditCaseFormModalComponent } from '../edit-case-form-modal/edit-case-form-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CasesService } from '../../services/cases.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cases-list',
  templateUrl: './cases-list.component.html',
  styleUrls: ['./cases-list.component.css']
})
export class CaseListComponent implements OnInit {
  cases: CaseInterface[] = [];
  searchCriteria: string = 'title';
  searchQuery: string = '';
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  constructor(private caseService: CasesService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute,
  private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadCases(this.currentPage, this.pageSize);
  }

  loadCases(page: number, size: number): void {
    this.caseService.getOpenAndInProgressCases(page, size).subscribe(
      (response) => {
        this.cases = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      (error) => {
        this.toastr.error("Error al cargar lista de casos! ", "ArcticCRM");
      }
    );
  }

  searchCases(): void {
    if (this.searchQuery.trim() === '') {
      this.loadCases(this.currentPage, this.pageSize);
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
              this.toastr.error("Error al buscar casos por id! ", "ArcticCRM");
              this.cases = [];
            }
          );
        } else {
          this.toastr.warning('No existe ningun caso con ese ID', 'ArctiCRM');
          this.cases = [];
        }
        break;
      default:
        this.toastr.error('Tipo de busqueda invalido', 'ArcticCRM');
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
        this.toastr.warning('Caso editado', 'ArcticCRM');
      }
      this.loadCases(this.currentPage, this.pageSize);
    });
  }

  viewCaseDetails(caseId: number) {
    if (caseId === undefined || caseId === null) {
      this.toastr.error('Caso invalido}', 'ArcticCRM');
      return;
    }
    this.router.navigate(['/details/cases', caseId]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCases(this.currentPage, this.pageSize);
  }
}
