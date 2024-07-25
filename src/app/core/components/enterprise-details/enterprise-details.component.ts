import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnterprisesInterface } from '../../interfaces/IEnterprises';
import { EnterprisesService } from '../../services/enterprises.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-enterprise-details',
  templateUrl: './enterprise-details.component.html',
  styleUrl: './enterprise-details.component.css'
})
export class EnterpriseDetailsComponent implements OnInit {
  enterprise: EnterprisesInterface | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private enterpriseService: EnterprisesService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const enterpriseId = +params['enterpriseId'];
      this.loadEnterpriseDetails(enterpriseId);
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

  goBack(): void {
    this.location.back();
  }
}