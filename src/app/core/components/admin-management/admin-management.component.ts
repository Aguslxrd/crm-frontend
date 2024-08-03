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

  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedLogs: ILogsInterface[] = [];

  constructor(private adminService: AdminService, 
    private caseService: CasesService, 
    public dialog: MatDialog,
    public enterpriseService: EnterprisesService,
    public toastr: ToastrService) {}

  ngOnInit(): void {
    this.getAdminUsers();
    this.getLogs();
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

  editAdmin(adminData: AdminInterface): void {
    const adminEditData: AdminEditInterface = {
      id: adminData.userId,
      email: adminData.email,
      adminName: adminData.username,
      passwd: '',  
      userrole: adminData.role
    };

    const dialogRef = this.dialog.open(EditAdminFormModalComponent, {
      width: '400px',
      data: adminEditData
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAdminUsers();
    });
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

  getSoftDeletedUsers(): void {
    this.adminService.getAllSoftDeletedUsers().subscribe((data) => {
      this.deactivatedUsers = data;
    });
  }

  reactivateCase(caseItem: CaseInterface): void {
    const dialogRef = this.dialog.open(EditCaseFormModalComponent, {
      width: '400px',
      data: caseItem
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
      }
    });
  }

  addNewAdministrador(): void {
    const dialogRef = this.dialog.open(NewAdminFormModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAdminUsers();
      }
    });
  }

  getDeletedEnterprises(): void {
    this.adminService.getAllSoftDeletedEnterprises().subscribe((data) => {
      this.deletedEnterprises = data;
    });
  }

  reactivateEnterprise(enterpriseId: number): void {
    this.adminService.activateEnterpriseById(enterpriseId).subscribe(
      (data) => {
        this.toastr.success('Empresa re-activada!', 'ArcticCRM');
      },
      (error) => {
        this.toastr.error('Error al reactivar la empresa!', 'ArcticCRM');
      }
    );
  }

}
