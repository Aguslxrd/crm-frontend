import { Component, OnInit } from '@angular/core';
import { CasesService } from '../../services/cases.service';
import { UserService } from '../../services/user.service';
import { EnterprisesService } from '../../services/enterprises.service';
import { count } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  totalCases: number = 0;
  openedCases: number = 0;
  inProgressCases: number = 0;
  totalUsers: number = 0;
  totalEnterprises: number = 0;

  constructor(
    private casesService: CasesService, 
    private userService: UserService,
    private enterpriseService: EnterprisesService) {}

  ngOnInit() {
    this.loadPanelData();
  }

  loadPanelData() {
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

    this.userService.getAllUsersCount().subscribe({
      next: (count) => this.totalUsers = count,
      error: (error) => console.error('Error fetching users data:', error)
    });

    this.enterpriseService.getAllEnterprisesCount().subscribe({
      next: (count) => this.totalEnterprises = count,
      error: (error) => console.error('Error fetching enterprise data:', error)
    });
  }

}