import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnterprisesInterface } from '../../interfaces/IEnterprises';
import { EnterprisesService } from '../../services/enterprises.service';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import { UserInterface } from '../../interfaces/IUser';
import { UserEnterpriseInterface } from '../../interfaces/IUser-Enterprise';
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
    private location: Location
  ) { }

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
      },
      (error) => {
        this.error = 'Error al cargar los detalles de la empresa';
        this.loading = false;
        console.error('Error fetching enterprise details:', error);
      }
    );
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  loadEnterpriseUsers(enterpriseId: number): void {
    this.enterpriseService.getUserEnterprise(enterpriseId).subscribe(
      (enterpriseUsers) => {
        this.enterpriseUsers = enterpriseUsers;
      },
      (error) => {
        console.error('Error fetching enterprise users:', error);
      }
    );
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
        },
        (error) => {
          console.error('Error assigning user to enterprise:', error);
        }
      );
    }
  }

  getUserFullName(userId: number): string {
    const user = this.users.find(u => u.userid === userId);
    return user ? `${user.firstname} ${user.firstlastname}` : 'Usuario desconocido';
  }

  goBack(): void {
    this.location.back();
  }
}