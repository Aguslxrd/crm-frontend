import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnterprisesInterface } from '../../interfaces/IEnterprises';
import { EnterprisesService } from '../../services/enterprises.service';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import { UserInterface } from '../../interfaces/IUser';
import { UserEnterpriseAssociation } from '../../interfaces/IUserEnterpriseAssociation';

@Component({
  selector: 'app-enterprise-details',
  templateUrl: './enterprise-details.component.html',
  styleUrls: ['./enterprise-details.component.css']
})
export class EnterpriseDetailsComponent implements OnInit {
  enterprise: EnterprisesInterface | null = null;
  users: UserInterface[] = [];
  enterpriseUsers: any[] = [];
  selectedUserId: number | null = null;
  loading: boolean = true;
  error: string | null = null;
  currentPage: number = 0;
  pageSize: number = 10;

  constructor(
    private route: ActivatedRoute,
    private enterpriseService: EnterprisesService,
    private userService: UserService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const enterpriseId = +params['enterpriseId'];
      this.loadEnterpriseDetails(enterpriseId);
      this.loadUsers();
      this.loadEnterpriseUsers(enterpriseId);
    });
  }

  loadEnterpriseDetails(enterpriseId: number): void {
    this.loading = true;
    this.enterpriseService.getEnterpriseByEnterpriseId(enterpriseId).subscribe(
      (enterprise) => {
        this.enterprise = enterprise;
        this.loading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.error = 'Error al cargar los detalles de la empresa';
        this.loading = false;
        console.error('Error fetching enterprise details:', error);
        this.cdr.detectChanges();
      }
    );
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe(
      (response) => {
        this.users = [...this.users, ...response.content];
        this.currentPage += 1;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      }
    );
  }

  loadEnterpriseUsers(enterpriseId: number): void {
    this.enterpriseService.getUserEnterprise(enterpriseId).subscribe(
      (enterpriseUsers) => {
        this.enterpriseUsers = enterpriseUsers.map(eu => ({...eu, fullName: null}));
        this.enterpriseUsers.forEach(eu => {
          if (eu && eu.id && eu.id.userId) {
            this.getUserFullName(eu.id.userId);
          } else {
            console.error('Invalid user data:', eu);
          }
        });
      },
      (error) => {
        console.error('Error fetching enterprise users:', error);
      }
    );
  }

  getUserFullName(userId: number): void {
    this.userService.searchUserByUserId(userId).subscribe(
      (user: UserInterface) => {
        if (user) {
          const fullName = `${user.firstname || ''} ${user.firstlastname || ''}`.trim();
          this.enterpriseUsers = this.enterpriseUsers.map(eu => {
            if (eu.id && eu.id.userId === userId) {
              return { ...eu, fullName: fullName };
            }
            return eu;
          });
          this.cdr.detectChanges();
        } else {
          console.warn(`User object is undefined for ID ${userId}`);
        }
      },
      (error) => {
        console.error(`Error fetching user details for userId ${userId}:`, error);
        this.cdr.detectChanges();
      }
    );
  }

  removeUserFromEnterprise(userId: number): void {
    const enterpriseId = this.enterprise?.enterpriseid;
    if (enterpriseId) {
      this.enterpriseService.deleteUserAssignedToEnterpriseById(userId, enterpriseId).subscribe(
        () => {
          this.loadEnterpriseUsers(enterpriseId);
        },
        (error) => {
          console.error('Error removing user from enterprise:', error);
        }
      );
    }
  }

  assignUserToEnterprise(): void {
    const enterpriseId = this.enterprise?.enterpriseid;
    if (enterpriseId && this.selectedUserId) {
      const userEnterpriseData: UserEnterpriseAssociation = {
        userId: this.selectedUserId,
        enterpriseId: enterpriseId
      };

      this.enterpriseService.saveUserEnterprise(userEnterpriseData).subscribe(
        (response) => {
          this.loadEnterpriseUsers(enterpriseId);
          this.selectedUserId = null;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error assigning user to enterprise:', error);
        }
      );
    }
  }

  trackByUserId(index: number, user: any): number {
    return user.id.userId;
  }

  goBack(): void {
    this.location.back();
  }
}
