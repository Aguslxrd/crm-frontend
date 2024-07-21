import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CasesService } from '../../services/cases.service';
import { CaseInterface } from '../../interfaces/ICase';
import { MatDialog } from '@angular/material/dialog';
import { NewCaseFormModalComponent } from '../new-case-form-modal/new-case-form-modal.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: any | null = null;
  userId: number | null = null;
  cases: CaseInterface[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private casesService: CasesService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    if (userIdParam) {
      this.userId = parseInt(userIdParam, 10);
      if (!isNaN(this.userId)) {
        this.loadUserDetails(this.userId);
        this.loadUserCases(this.userId);
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

  loadUserCases(userId: number): void {
    this.casesService.getCasesByUserId(userId).subscribe(
      (cases) => {
        this.cases = cases;
        console.log('User cases:', this.cases);
      },
      (error) => {
        console.error('Error fetching user cases:', error);
      }
    );
  }

  backButton(): void {
    this.router.navigate(['/home']);
  }

  addCase(): void {
    const dialogRef = this.dialog.open(NewCaseFormModalComponent, {
      width: '400px',
      data: { userId: this.userId } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Case saved:', result);
        this.loadUserCases(this.userId as number);
      }
    });
  }


  editCase(): void {
    //to-do
  }

  viewCase(caseId: number | string): void {
    this.router.navigate(['/user/details/cases/interactions', caseId]);
  }

}