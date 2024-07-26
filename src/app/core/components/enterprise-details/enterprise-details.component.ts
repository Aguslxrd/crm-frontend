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
    console.log('Initial enterpriseUsers:', this.enterpriseUsers);
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
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  loadEnterpriseUsers(enterpriseId: number): void {
    this.enterpriseService.getUserEnterprise(enterpriseId).subscribe(
      (enterpriseUsers) => {
        console.log('Received enterprise users:', enterpriseUsers);
        this.enterpriseUsers = enterpriseUsers.map(eu => ({...eu, fullName: null}));
        enterpriseUsers.forEach(eu => {
          if (eu && eu.id && eu.id.userId) {
            this.getUserFullName(eu.id.userId);
          } else {
            console.error('Invalid user data:', eu);
          }
        });
        console.log('Enterprise Users after initial mapping:', this.enterpriseUsers);
      },
      (error) => {
        console.error('Error fetching enterprise users:', error);
      }
    );
  }
  
  getUserFullName(userId: number): void {
    console.log(`Fetching details for user ID: ${userId}`);
    this.userService.searchUserByUserId(userId).subscribe(
      (user: UserInterface) => {
        console.log(`Received user data for ID ${userId}:`, user);
        if (user) {
          const fullName = `${user.firstname || ''} ${user.firstlastname || ''}`.trim();
          console.log(`Full name for user ${userId}: ${fullName}`);
          this.enterpriseUsers = this.enterpriseUsers.map(eu => {
            if (eu.id && eu.id.userId === userId) {
              console.log(`Updating user with ID ${userId} to fullName: ${fullName}`);
              return { ...eu, fullName: fullName };
            }
            return eu;
          });
          console.log('Updated enterpriseUsers:', this.enterpriseUsers);
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
    if (this.enterprise) {
      this.enterpriseService.deleteUserAssignedToEnterpriseById(userId, this.enterprise.enterpriseid).subscribe(
        () => {
          console.log(`User ${userId} removed from enterprise ${this.enterprise?.enterpriseid}`);
        },
        (error) => {
          console.error('Error removing user from enterprise:', error);
        }
      );
    }
  }
  
  
  
  assignUserToEnterprise(): void {
    if (this.enterprise && this.selectedUserId) {
      const userEnterpriseData: UserEnterpriseAssociation = {
        userId: this.selectedUserId,
        enterpriseId: this.enterprise.enterpriseid
      };

      this.enterpriseService.saveUserEnterprise(userEnterpriseData).subscribe(
        (response) => {
          console.log('User assigned to enterprise successfully', response);
          this.loadEnterpriseUsers(this.enterprise!.enterpriseid);
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
