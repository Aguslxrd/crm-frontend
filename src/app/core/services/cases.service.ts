import { Injectable } from '@angular/core';
import { StorageService } from './storage-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CasesService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/cases';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  
}
