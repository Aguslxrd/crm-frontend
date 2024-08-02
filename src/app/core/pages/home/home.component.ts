import { Component, OnInit } from '@angular/core';
import { CasesService } from '../../services/cases.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  totalCases: number = 0;
  openedCases: number = 0;
  inProgressCases: number = 0;

  constructor(private casesService: CasesService) {}

  ngOnInit() {
    this.loadCaseCounts();
  }

  loadCaseCounts() {
    this.casesService.getAllCasesCount().subscribe({
      next: (count) => this.totalCases = count,
      error: (error) => console.error('Error fetching total cases:', error)
    });

    this.casesService.getAllOpenedCasesCount().subscribe({
      next: (count) => this.openedCases = count,
      error: (error) => console.error('Error fetching opened cases:', error)
    });

    this.casesService.getAllInProgressCasesCount().subscribe({
      next: (count) => this.inProgressCases = count,
      error: (error) => console.error('Error fetching in-progress cases:', error)
    });
  }
}