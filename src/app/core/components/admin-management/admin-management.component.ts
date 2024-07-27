import { Component, OnInit } from '@angular/core';
import { AdminInterface } from '../../interfaces/IAdminUsers';
import { AdminService } from '../../services/admin.service';
import { ILogsInterface } from '../../interfaces/ILoggsInterface';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrl: './admin-management.component.css'
})
export class AdminManagementComponent implements OnInit{
  adminUsers: AdminInterface[] = [];
  logs: ILogsInterface[] = [];
  searchQuery: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getAdminUsers();
    this.getLogs();
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
    // Implementa la lógica para editar un usuario administrativo
  }

  deleteAdmin(userId: number): void {
    this.adminService.deleteAdminById(userId).subscribe(() => {
      this.getAdminUsers();  // Refrescar la lista después de eliminar un usuario
    });
  }

  getLogs(): void {
    this.adminService.getSystemLogs().subscribe((data) => {
      this.logs = data;
    });
  }
}