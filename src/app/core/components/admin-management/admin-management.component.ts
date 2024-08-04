import { Component, OnInit } from '@angular/core';
import { AdminInterface } from '../../interfaces/IAdminUsers';
import { AdminService } from '../../services/admin.service';
import { ILogsInterface } from '../../interfaces/ILoggsInterface';
import { CaseInterface } from '../../interfaces/ICase';
import { CasesService } from '../../services/cases.service';
import { MatDialog } from '@angular/material/dialog';
import { UserInterface } from '../../interfaces/IUser';
import { EditCaseFormModalComponent } from '../edit-case-form-modal/edit-case-form-modal.component';
import { EditUserFormModalComponent } from '../edit-user-form-modal/edit-user-form-modal.component';
import { NewAdminFormModalComponent } from '../new-admin-form-modal/new-admin-form-modal.component';
import { EditAdminFormModalComponent } from '../edit-admin-form-modal/edit-admin-form-modal.component';
import { AdminEditInterface } from '../../interfaces/IAdminEditInterface';
import { EnterprisesService } from '../../services/enterprises.service';
import { EnterprisesInterface } from '../../interfaces/IEnterprises';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {
  adminUsers: AdminInterface[] = [];
  logs: ILogsInterface[] = [];
  closedCases: CaseInterface[] = [];
  deactivatedUsers: UserInterface[] = [];
  searchQuery: string = '';
  deletedEnterprises: EnterprisesInterface[] = [];
  activateEnterprise = false;

  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  currentEnterprisePage: number = 0;
  totalEnterprisePages: number = 0;

  currentDeactivatedUsersPage: number = 0; 
  totalDeactivatedUsersPages: number = 0; 

  currentClosedCasesPage: number = 0;
  totalClosedCasesPages: number = 0;

  constructor(
    private adminService: AdminService, 
    private caseService: CasesService, 
    public dialog: MatDialog,
    public enterpriseService: EnterprisesService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAdminUsers();
    this.getLogs(this.currentPage, this.pageSize);
    this.getClosedCases(this.currentClosedCasesPage, this.pageSize);
    this.getSoftDeletedUsers(this.currentDeactivatedUsersPage, this.pageSize);
    this.getDeletedEnterprises(this.currentEnterprisePage, this.pageSize);
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

  openDialog(component: any, data: any, callback: () => void): void {
    const dialogRef = this.dialog.open(component, {
      width: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        callback();
      }
    });
  }

  editAdmin(adminData: AdminInterface): void {
    const adminEditData: AdminEditInterface = {
      id: adminData.userId,
      email: adminData.email,
      adminName: adminData.username,
      passwd: '',  
      userrole: adminData.role
    };
    this.openDialog(EditAdminFormModalComponent, adminEditData, () => this.getAdminUsers());
  }

  deleteAdmin(userId: number): void {
    this.adminService.deleteAdminById(userId).subscribe(() => {
      this.getAdminUsers();
    });
  }

  getLogs(page: number, size: number): void {
    this.adminService.getSystemLogs(page, size).subscribe(
      (response) => {
        this.logs = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      (error) => {
        console.error('Error fetching logs:', error);
      }
    );
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getLogs(this.currentPage, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getLogs(this.currentPage, this.pageSize);
    }
  }

  getClosedCases(page: number, size: number): void {
    this.adminService.getAllClosedCases(page, size).subscribe((response) => {
      this.closedCases = response.content;
      this.totalClosedCasesPages = response.totalPages;
    });
  }

  getSoftDeletedUsers(page: number, size: number): void {
    this.adminService.getAllSoftDeletedUsers(page, size).subscribe((response) => {
      this.deactivatedUsers = response.content;
      this.totalElements = response.totalElements;
      this.totalDeactivatedUsersPages = response.totalPages; 
    });
  }
  
  reactivateCase(caseItem: CaseInterface): void {
    this.openDialog(EditCaseFormModalComponent, caseItem, () => this.getClosedCases(this.currentClosedCasesPage, this.pageSize));
  }

  reactivateUser(userData: UserInterface): void {
    this.openDialog(EditUserFormModalComponent, userData, () => this.getSoftDeletedUsers(this.currentDeactivatedUsersPage, this.pageSize));
  }  

  addNewAdmin(): void {
    this.openDialog(NewAdminFormModalComponent, null, () => this.getAdminUsers());
  }

  getDeletedEnterprises(page: number, size: number): void {
    this.adminService.getAllSoftDeletedEnterprises(page, size).subscribe((response) => {
      this.deletedEnterprises = response.content;
      this.totalElements = response.totalElements;
      this.totalEnterprisePages = response.totalPages;
    });
  }

  reactivateEnterprise(enterpriseId: number): void {
    this.adminService.activateEnterpriseById(enterpriseId).subscribe(
      () => {
        this.toastr.success('Empresa re-activada!', 'ArcticCRM');
        this.getDeletedEnterprises(this.currentEnterprisePage, this.pageSize);
      },
      (error) => {
        this.toastr.error('Error al reactivar la empresa!', 'ArcticCRM');
      }
    );
  }

  previousEnterprisePage(): void {
    if (this.currentEnterprisePage > 0) {
      this.currentEnterprisePage--;
      this.getDeletedEnterprises(this.currentEnterprisePage, this.pageSize);
    }
  }
  
  nextEnterprisePage(): void {
    if (this.currentEnterprisePage < this.totalEnterprisePages - 1) {
      this.currentEnterprisePage++;
      this.getDeletedEnterprises(this.currentEnterprisePage, this.pageSize);
    }
  }

  previousDeactivatedUsersPage(): void {
    if (this.currentDeactivatedUsersPage > 0) {
      this.currentDeactivatedUsersPage--;
      this.getSoftDeletedUsers(this.currentDeactivatedUsersPage, this.pageSize);
    }
  }
  
  nextDeactivatedUsersPage(): void {
    if (this.currentDeactivatedUsersPage < this.totalDeactivatedUsersPages - 1) {
      this.currentDeactivatedUsersPage++;
      this.getSoftDeletedUsers(this.currentDeactivatedUsersPage, this.pageSize);
    }
  }

  previousClosedCasesPage(): void {
    if (this.currentClosedCasesPage > 0) {
      this.currentClosedCasesPage--;
      this.getClosedCases(this.currentClosedCasesPage, this.pageSize);
    }
  }

  nextClosedCasesPage(): void {
    if (this.currentClosedCasesPage < this.totalClosedCasesPages - 1) {
      this.currentClosedCasesPage++;
      this.getClosedCases(this.currentClosedCasesPage, this.pageSize);
    }
  }
  
  
}
