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
import { AdminRegisterInterface } from '../../interfaces/IAdminRegister';
import { EnterprisesService } from '../../services/enterprises.service';
import { EnterprisesInterface } from '../../interfaces/IEnterprises';
import { ToastrService } from 'ngx-toastr';
import { LogsResponse } from '../../interfaces/ILogsResponse';

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
    this.getClosedCases();
    this.getSoftDeletedUsers();
    this.getDeletedEnterprises();
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

  getClosedCases(): void {
    this.adminService.getAllClosedCases().subscribe((data) => {
      this.closedCases = data;
    });
  }

  getSoftDeletedUsers(): void {
    this.adminService.getAllSoftDeletedUsers().subscribe((data) => {
      this.deactivatedUsers = data;
    });
  }

  reactivateCase(caseItem: CaseInterface): void {
    this.openDialog(EditCaseFormModalComponent, caseItem, () => this.getClosedCases());
  }

  reactivateUser(userData: UserInterface): void {
    this.openDialog(EditUserFormModalComponent, userData, () => this.getSoftDeletedUsers());
  }

  addNewAdmin(): void {
    this.openDialog(NewAdminFormModalComponent, null, () => this.getAdminUsers());
  }

  getDeletedEnterprises(): void {
    this.adminService.getAllSoftDeletedEnterprises().subscribe((data) => {
      this.deletedEnterprises = data;
    });
  }

  reactivateEnterprise(enterpriseId: number): void {
    this.adminService.activateEnterpriseById(enterpriseId).subscribe(
      () => {
        this.toastr.success('Empresa re-activada!', 'ArcticCRM');
        this.getDeletedEnterprises();
      },
      (error) => {
        this.toastr.error('Error al reactivar la empresa!', 'ArcticCRM');
      }
    );
  }
}


