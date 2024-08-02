import { Component, OnInit } from '@angular/core';
import { UserInterface } from '../../interfaces/IUser';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NewUserFormModalComponent } from '../new-user-form-modal/new-user-form-modal.component';
import { Observable } from 'rxjs';
import { EditUserFormModalComponent } from '../edit-user-form-modal/edit-user-form-modal.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css'
})
export class UserlistComponent implements OnInit {
  users: UserInterface[] = [];
  searchCriteria: string = 'email';
  searchQuery: string = '';

  constructor(private userService: UserService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.error('Error fetching users:', error);
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
            console.error('Error searching users by email:', error);
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
              console.error('Error searching users by identifier:', error);
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
              console.error('Error searching users by phone number:', error);
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
                console.error('Error searching users by user ID:', error);
                this.users = [];
              }
            );
          } else {
            console.error('Invalid user ID');
            this.users = [];
          }
          break;
        default:
          console.error('Invalid search criteria:', this.searchCriteria);
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
        console.log('User saved:', result);
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
        console.log('User Edited:', result);
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

}