import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class EnterprisesService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/enterprises';

  constructor(private http: HttpClient, private storageService: StorageService) {}

}
