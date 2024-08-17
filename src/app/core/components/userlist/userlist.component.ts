import { Component, OnInit } from '@angular/core';
import { UserInterface } from '../../interfaces/IUser';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NewUserFormModalComponent } from '../new-user-form-modal/new-user-form-modal.component';
import { Observable } from 'rxjs';
import { EditUserFormModalComponent } from '../edit-user-form-modal/edit-user-form-modal.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css'
})
export class UserlistComponent implements OnInit {
  users: UserInterface[] = [];
  searchCriteria: string = 'email';
  searchQuery: string = '';
  currentPage: number = 0;
  totalPages: number = 0;
  size: number = 10;

  constructor(private userService: UserService, 
    public dialog: MatDialog, 
    private router: Router,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers(this.currentPage, this.size).subscribe(
      (response) => {
        this.users = response.content;
        this.totalPages = response.totalPages;
      },
      (error) => {
        this.toastr.warning('No se encontraron usuarios', 'ArcticCRM');
      }
    );
  }

  searchUsers(): void {
    if (this.searchQuery.trim() === '') {
      this.loadUsers();
      return;
    }

    switch (this.searchCriteria) {
      case 'email':
        this.userService.searchUsersByEmail(this.searchQuery).subscribe(
          (response) => {
            this.users = Array.isArray(response) ? response : [response];
          },
          (error) => {
            this.toastr.error('Error no se encontro usuario por email', 'ArcticCRM');
            this.users = [];
          }
        );
        break;
      case 'identifier':
        this.userService.searchUserByIdentifier(this.searchQuery).subscribe(
          (response) => {
            this.users = Array.isArray(response) ? response : [response];
          },
          (error) => {
            this.toastr.error('Error no se encontro usuario por identificador', 'ArcticCRM');
            this.users = [];
          }
        );
        break;
      case 'phoneNumber':
        this.userService.searchUserByPhone(this.searchQuery).subscribe(
          (response) => {
            this.users = Array.isArray(response) ? response : [response];
          },
          (error) => {
            this.toastr.error('Error no se encontro usuario por telefono', 'ArcticCRM');
            this.users = [];
          }
        );
        break;
      case 'userId':
        const userId = parseInt(this.searchQuery, 10);
        if (!isNaN(userId)) {
          this.userService.searchUserByUserId(userId).subscribe(
            (response) => {
              this.users = Array.isArray(response) ? response : [response];
            },
            (error) => {
              this.toastr.error('Error no se encontro usuario con id', 'ArcticCRM');
              this.users = [];
            }
          );
        } else {
          this.toastr.error('Error no se encontro usuario', 'ArcticCRM');
          this.users = [];
        }
        break;
      default:
        this.toastr.warning('Tipo de busqueda no valida', 'ArcticCRM');
        this.users = []; 
        break;
    }
  }

  openSaveUserModal(): void {
    const dialogRef = this.dialog.open(NewUserFormModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Usuario guardado', 'ArcticCRM');
        this.loadUsers();
      }
    });
  }

  editUser(user: UserInterface): void {
    const dialogRef = this.dialog.open(EditUserFormModalComponent, {
      width: '400px',
      data: user 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Usuario editado', 'ArcticCRM');
      }
      this.loadUsers();
    });
  }

  deleteUser(userId: number): void {
    Swal.fire({
      title: "Confirmacion",
      text: "Seguro que deseas eliminar este cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, deseo eliminarlo!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado!",
          text: "Este usuario fue eliminado.",
          icon: "success"
        });
        this.userService.deleteUserById(userId).subscribe(
          () => this.loadUsers()
        );
      }
    });
  }

  viewUserDetails(userId: number | string) {
    this.router.navigate(['/user/details', userId]);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers();
    }
  }
}