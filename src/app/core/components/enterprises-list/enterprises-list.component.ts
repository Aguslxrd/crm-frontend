import { Component, OnInit } from '@angular/core';
import { EnterprisesInterface } from '../../interfaces/IEnterprises';
import { EnterprisesService } from '../../services/enterprises.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NewEnterpriseFormModalComponent } from '../new-enterprise-form-modal/new-enterprise-form-modal.component';
import { EditEnterpriseFormModalComponent } from '../edit-enterprise-form-modal/edit-enterprise-form-modal.component';
import Swal from 'sweetalert2';
import { EnterpriseResponse } from '../../interfaces/IEnterpriseResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enterprises-list',
  templateUrl: './enterprises-list.component.html',
  styleUrls: ['./enterprises-list.component.css']
})

export class EnterprisesListComponent implements OnInit {
  enterprises: EnterprisesInterface[] = [];
  searchCriteria: string = 'name';
  searchQuery: string = '';
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  constructor(
    private enterpriseService: EnterprisesService, 
    public dialog: MatDialog, 
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadEnterprises();
  }

  loadEnterprises(): void {
    this.enterpriseService.getEnterprises(this.currentPage, this.pageSize).subscribe(
      (response: EnterpriseResponse) => {
        this.enterprises = response.content;
        this.totalPages = response.totalPages;
      },
      (error) => {
        this.toastr.warning('No se encontraron empresas', 'ArcticCRM');
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
            this.toastr.error('Empresa no encontrada con el nombre', 'ArcticCRM');
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
            this.toastr.error('Empresa no encontrada con rut', 'ArcticCRM');
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
              this.toastr.error('Empresa no encontrada con id', 'ArcticCRM');
              this.enterprises = [];
            }
          );
        } else {
          this.toastr.error('Empresa no encontrada', 'ArcticCRM');
          this.enterprises = [];
        }
        break;
      default:
        this.toastr.warning('Tipo de busqueda no valida', 'ArcticCRM');
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
        this.toastr.success('Empresa guardada', 'ArcticCRM');
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
        this.toastr.success('Empresa editada', 'ArcticCRM');
      }
      this.loadEnterprises();
    });
  }

  deleteEnterprise(enterpriseId: number): void {
    Swal.fire({
      title: "Confirmacion",
      text: "Seguro que deseas eliminar esta empresa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, deseo eliminarla!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado!",
          text: "Esta empresa fue eliminada.",
          icon: "success"
        });
        this.enterpriseService.deleteEnterpriseById(enterpriseId).subscribe(
          () => this.loadEnterprises()
        );
      }
    });
  }

  viewEnterpriseDetails(enterpriseId: number) {
    this.router.navigate(['/enterprises/details', enterpriseId]);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadEnterprises();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEnterprises();
    }
  }
  
}