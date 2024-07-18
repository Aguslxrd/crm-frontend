import { Injectable } from '@angular/core';
import { StorageService } from './storage-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaseInterface } from '../interfaces/ICase';

@Injectable({
  providedIn: 'root'
})
export class CasesService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/cases';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  getCasesByUserId(userId: number) : Observable<CaseInterface[]>{
    const token = this.storageService.getToken();

    if(token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<CaseInterface[]>(`${this.apiUrl}/user/${userId}`, { headers });
    }
    console.error('No token found in localStorage');
    return new Observable<CaseInterface[]>();
  }


}
