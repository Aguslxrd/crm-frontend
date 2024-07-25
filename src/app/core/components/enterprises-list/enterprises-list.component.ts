import { Component, OnInit } from '@angular/core';
import { EnterprisesInterface } from '../../interfaces/IEnterprises';
import { EnterprisesService } from '../../services/enterprises.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditCaseFormModalComponent } from '../edit-case-form-modal/edit-case-form-modal.component';
import { NewEnterpriseFormModalComponent } from '../new-enterprise-form-modal/new-enterprise-form-modal.component';
import { EditEnterpriseFormModalComponent } from '../edit-enterprise-form-modal/edit-enterprise-form-modal.component';

@Component({
  selector: 'app-enterprises-list',
  templateUrl: './enterprises-list.component.html',
  styleUrls: ['./enterprises-list.component.css']
})

export class EnterprisesListComponent implements OnInit {
  enterprises: EnterprisesInterface[] = [];
  searchCriteria: string = 'name';
  searchQuery: string = '';

  constructor(
    private enterpriseService: EnterprisesService, 
    public dialog: MatDialog, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEnterprises();
  }

  loadEnterprises(): void {
    this.enterpriseService.getEnterprises().subscribe(
      (response) => {
        this.enterprises = response;
      },
      (error) => {
        console.error('Error fetching enterprises:', error);
      }
    );
  }

  searchEnterprises(): void {
    if (this.searchQuery.trim() === '') {
      this.loadEnterprises();
      return;
    }
  
    switch (this.searchCriteria) {
      case 'name':
        this.enterpriseService.getEnterprisesByName(this.searchQuery).subscribe(
          (response) => {
            this.enterprises = Array.isArray(response) ? response : [response];
          },
          (error) => {
            console.error('Error searching enterprises by name:', error);
            this.enterprises = [];
          }
        );
        break;
      case 'rut':
        this.enterpriseService.getEnterpriseByRut(this.searchQuery).subscribe(
          (response) => {
            this.enterprises = Array.isArray(response) ? response : [response];
          },
          (error) => {
            console.error('Error searching enterprises by RUT:', error);
            this.enterprises = [];
          }
        );
        break;
      case 'enterpriseId':
        const enterpriseId = parseInt(this.searchQuery, 10);
        if (!isNaN(enterpriseId)) {
          this.enterpriseService.getEnterpriseByEnterpriseId(enterpriseId).subscribe(
            (response) => {
              this.enterprises = Array.isArray(response) ? response : [response];
            },
            (error) => {
              console.error('Error searching enterprises by ID:', error);
              this.enterprises = [];
            }
          );
        } else {
          console.error('Invalid enterprise ID');
          this.enterprises = [];
        }
        break;
      default:
        console.error('Invalid search criteria:', this.searchCriteria);
        this.enterprises = []; 
        break;
    }
  }

  openSaveEnterpriseModal(): void {
    const dialogRef = this.dialog.open(NewEnterpriseFormModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Enterprise saved:', result);
        this.loadEnterprises();
      }
    });
  }

  editEnterprise(enterprise: EnterprisesInterface): void {
    const dialogRef = this.dialog.open(EditEnterpriseFormModalComponent, {
      width: '400px',
      data: enterprise 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Enterprise Edited:', result);
      }
      this.loadEnterprises();
    });
  }

  /*deleteEnterprise(enterpriseId: number): void {
    this.enterpriseService.deleteEnterpriseById(enterpriseId).subscribe(
      () => this.loadEnterprises()
    );
  }*/

  viewEnterpriseDetails(enterpriseId: number) {
    this.router.navigate(['/enterprises/details', enterpriseId]);
  }
}