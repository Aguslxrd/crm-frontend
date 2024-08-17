import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnterprisesInterface } from '../../interfaces/IEnterprises';
import { EnterprisesService } from '../../services/enterprises.service';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import { UserInterface } from '../../interfaces/IUser';
import { UserEnterpriseAssociation } from '../../interfaces/IUserEnterpriseAssociation';
import { ToastrService } from 'ngx-toastr';

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
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
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
        this.loading = false;
        this.toastr.error('Error al cargar detalles de la empresa', 'ArcticCRM');
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
        this.toastr.warning('No se encontraron usuarios', 'ArcticCRM');
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
            this.toastr.error('Datos de usuarios invalidos', 'ArcticCRM');
          }
        });
      },
      (error) => {
        this.toastr.error('Error al cargar datos de usuarios', 'ArcticCRM');
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
          //nothing
        }
      },
      (error) => {
        this.toastr.warning('No se encontraron detalles de casos del usuario', 'ArcticCRM');
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
          this.toastr.error('No ha sido posible remover al usuario', 'ArcticCRM');
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
          this.toastr.error('Error al asignar el usuario con una empresa', 'ArcticCRM');
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
