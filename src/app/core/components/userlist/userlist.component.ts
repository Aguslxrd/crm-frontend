import { Component, OnInit } from '@angular/core';
import { UserInterface } from '../../interfaces/IUser';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NewUserFormModalComponent } from '../new-user-form-modal/new-user-form-modal.component';

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
      (response) => this.users = response,
      (error) => console.error('Error fetching users:', error)
    );
  }

  searchUsers(): void {
    
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

}