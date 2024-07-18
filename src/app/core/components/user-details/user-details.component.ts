import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserInterface } from '../../interfaces/IUser';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: any | null = null; // cambiar a user interface
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    if (userIdParam) {
      this.userId = parseInt(userIdParam, 10);
      if (!isNaN(this.userId)) {
        this.loadUserDetails(this.userId);
      } else {
        console.error('Invalid userId in URL');
      }
    }
  }

  loadUserDetails(userId: number): void {
    this.userService.searchUserByUserId(userId).subscribe(
      (user) => {
        this.user = user;
        console.log('User data:', this.user);
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  backButton() : void{
    this.router.navigate(['/home'])
  }
}