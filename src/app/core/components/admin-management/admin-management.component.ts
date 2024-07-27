import { Component, OnInit } from '@angular/core';
import { AdminInterface } from '../../interfaces/IAdminUsers';
import { AdminService } from '../../services/admin.service';
import { ILogsInterface } from '../../interfaces/ILoggsInterface';
import { CaseInterface } from '../../interfaces/ICase';
import { CasesService } from '../../services/cases.service';
import { EditCaseFormModalComponent } from '../edit-case-form-modal/edit-case-form-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { UserInterface } from '../../interfaces/IUser';
import { EditUserFormModalComponent } from '../edit-user-form-modal/edit-user-form-modal.component';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrl: './admin-management.component.css'
})
export class AdminManagementComponent implements OnInit{
  adminUsers: AdminInterface[] = [];
  logs: ILogsInterface[] = [];
  closedCases: CaseInterface[] = [];
  deactivatedUsers: UserInterface[] = [];
  searchQuery: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedLogs: ILogsInterface[] = [];

  constructor(private adminService: AdminService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAdminUsers();
    this.getLogs();
    this.getClosedCases();
  }

  getAdminUsers(): void {
    this.adminService.getAdminUsers().subscribe((data) => {
      this.adminUsers = data;
    });
  }

  searchAdminUsers(): void {
    if (this.searchQuery) {
      this.adminUsers = this.adminUsers.filter(
        (admin) =>
          admin.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          admin.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.getAdminUsers();
    }
  }

  editAdmin(admin: AdminInterface): void {

  }

  deleteAdmin(userId: number): void {
    this.adminService.deleteAdminById(userId).subscribe(() => {
      this.getAdminUsers();  
    });
  }

  getLogs(): void {
    this.adminService.getSystemLogs().subscribe((data) => {
      this.logs = data;
      this.paginateLogs();
    });
  }

  paginateLogs(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedLogs = this.logs.slice(start, end);
  }

  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.logs.length) {
      this.currentPage++;
      this.paginateLogs();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateLogs();
    }
  }
  getClosedCases(): void {
    this.adminService.getAllClosedCases().subscribe((data) => {
      this.closedCases = data;
    });
  }

  reactivateCase(caseItem: CaseInterface): void {
    const dialogRef = this.dialog.open(EditCaseFormModalComponent, {
      width: '400px',
      data: caseItem
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Case Edited:', result);
      }
    });
  }

  reactivateUser(userData: UserInterface): void {
    const dialogRef = this.dialog.open(EditUserFormModalComponent, {
      width: '400px',
      data: userData
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User Edited:', result);
      }
    });
  }

}