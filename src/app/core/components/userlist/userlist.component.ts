import { Component, OnInit } from '@angular/core';
import { UserInterface } from '../../interfaces/IUser';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NewUserFormModalComponent } from '../new-user-form-modal/new-user-form-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css'
})
export class UserlistComponent implements OnInit {
  users: UserInterface[] = [];
  searchCriteria: string = 'email';
  searchQuery: string = '';

  constructor(private userService: UserService, public dialog: MatDialog) {}

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
    //shit code dont work's, ERROR 
    //bug: NG0900: Error trying to diff '[object Object]'. Only arrays and iterables are allowed
    if (this.searchQuery.trim() === '') {
      this.loadUsers();
      return;
    }

    switch (this.searchCriteria) {
      case 'email':
        this.userService.searchUsersByEmail(this.searchQuery).subscribe(
          (response) => {
            this.users = response;
          },
          (error) => {
            console.error('Error searching users by email:', error);
          }
        );
        break;
      default:
        console.error('Invalid search criteria:', this.searchCriteria);
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
      }
    });
  }

  editUser(user: UserInterface): void {
    
  }

  deleteUser(userId: string): void {
    
  }

  viewUserData(): void{

  }

}