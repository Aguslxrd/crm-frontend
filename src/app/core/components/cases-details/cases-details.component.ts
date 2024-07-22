import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseInterface } from '../../interfaces/ICase';
import { CasesService } from '../../services/cases.service';

@Component({
  selector: 'app-cases-details',
  templateUrl: './cases-details.component.html',
  styleUrls: ['./cases-details.component.css']
})
export class CaseDetailsComponent implements OnInit {
  caseDetails: any | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private caseService: CasesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const caseId = +params['caseId'];
      this.loadCaseDetails(caseId);
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

  goBack(): void {
    window.history.back();
  }
}