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
import { ToastrService } from 'ngx-toastr';

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
    public dialog: MatDialog,
    private toastr: ToastrService
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
        this.toastr.error('Error no ha sido posible encontrar el cliente', 'ArcticCRM');
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
        this.toastr.error('Error no se encontro detalles del usuario', 'ArcticCRM');
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
          this.toastr.warning('No se encontro empresa vinculada al cliente', 'ArcticCRM');
          this.hasEnterprise = false;
          this.enterprise = null;
        }
      },
      error => {
        this.toastr.warning('No se encontro empresa vinculada al cliente', 'ArcticCRM');
        this.hasEnterprise = false;
        this.enterprise = null;
      }
    );
  }

  loadEnterpriseDetails(enterpriseId: number): void {
    this.enterprisesService.getEnterpriseByEnterpriseId(enterpriseId).subscribe(
      (enterprise: EnterprisesInterface) => {
        this.enterprise = enterprise;
      },
      (error) => {
        this.toastr.warning('Error no se encontro detalles de la empresa', 'ArcticCRM');
      }
    );
  }

  loadUserCases(userId: number): void {
    this.casesService.getCasesByUserId(userId).subscribe(
      (cases) => {
        this.cases = cases;
      },
      (error) => {
        this.toastr.warning('Error no se encontro casos del cliente', 'ArcticCRM');
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
          this.loadUserCases(this.userId as number);
        }
      });
    } else {
      this.toastr.error('Id de cliente no definido', 'ArcticCRM');
    }
  }

  viewCase(caseId: number | string): void {
    this.router.navigate(['/user/details/cases/interactions', caseId]);
  }
}