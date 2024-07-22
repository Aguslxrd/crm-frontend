import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CasesService } from '../../services/cases.service';
import { CaseInterface } from '../../interfaces/ICase';
import { MatDialog } from '@angular/material/dialog';
import { NewCaseFormModalComponent } from '../new-case-form-modal/new-case-form-modal.component';
import { EditCaseFormModalComponent } from '../edit-case-form-modal/edit-case-form-modal.component';
import { EnterprisesService } from '../../services/enterprises.service';
import { EnterprisesInterface } from '../../interfaces/IEnterprises';
import { UserEnterpriseInterface } from '../../interfaces/IUser-Enterprise';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: any | null = null;
  userId: number | null = null;
  cases: CaseInterface[] = [];
  enterprise: EnterprisesInterface | null = null;
  hasEnterprise: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private casesService: CasesService,
    private enterprisesService: EnterprisesService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    if (userIdParam) {
      this.userId = parseInt(userIdParam, 10);
      if (!isNaN(this.userId)) {
        this.loadUserDetails(this.userId);
        this.loadUserCases(this.userId);
        this.loadUserEnterprise(this.userId);
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

  loadUserEnterprise(userId: number): void {
    this.enterprisesService.getUserEnterprise(userId).subscribe(
      (userEnterprises: UserEnterpriseInterface[]) => {
        console.log('User enterprise data:', userEnterprises);
        if (userEnterprises && userEnterprises.length > 0 && userEnterprises[0].id && userEnterprises[0].id.enterpriseId) {
          this.loadEnterpriseDetails(userEnterprises[0].id.enterpriseId);
          this.hasEnterprise = true;
        } else {
          console.log('No enterprise associated with this user or unexpected data structure');
          console.log('Received data:', userEnterprises);
          this.hasEnterprise = false;
          this.enterprise = null;
        }
      },
      error => {
        console.error('Error fetching user enterprise:', error);
        this.hasEnterprise = false;
        this.enterprise = null;
      }
    );
  }

  loadEnterpriseDetails(enterpriseId: number): void {
    this.enterprisesService.getEnterpriseByEnterpriseId(enterpriseId).subscribe(
      (enterprise: EnterprisesInterface) => {
        this.enterprise = enterprise;
        console.log('Enterprise data:', this.enterprise);
      },
      (error) => {
        console.error('Error fetching enterprise details:', error);
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
  
  editCase(caseId: number): void {
    if (this.userId) {
      console.log('Opening EditCaseFormModalComponent with caseId:', caseId, 'and userId:', this.userId);
      
      const dialogRef = this.dialog.open(EditCaseFormModalComponent, {
        width: '400px',
        data: { caseId: caseId, userId: this.userId }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Case updated:', result);
          this.loadUserCases(this.userId as number);
        }
      });
    } else {
      console.error('userId is not defined');
    }
  }

  viewCase(caseId: number | string): void {
    this.router.navigate(['/user/details/cases/interactions', caseId]);
  }
}