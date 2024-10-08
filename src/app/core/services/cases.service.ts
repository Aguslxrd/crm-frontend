import { Injectable } from '@angular/core';
import { StorageService } from './storage-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { CaseInterface } from '../interfaces/ICase';

@Injectable({
  providedIn: 'root'
})
export class CasesService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/cases';
  private readonly openAndInProgressCasesEndpoint = 'open-and-in-progress';

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

  getCaseById(caseId: number) : Observable<CaseInterface[]>{
    const token = this.storageService.getToken();
    if(token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<CaseInterface[]>(`${this.apiUrl}/${caseId}`, {headers});
    }else{
      console.error("No token found in localStorage");
      return new Observable<CaseInterface[]>();
    }

  }

  saveCase(caseData: CaseInterface): Observable<CaseInterface> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<CaseInterface>(this.apiUrl, caseData, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<CaseInterface>();
    }
  }

  getCases(): Observable<CaseInterface[]> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<CaseInterface[]>(this.apiUrl, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<CaseInterface[]>(); 
    }
  }

  getOpenAndInProgressCases(): Observable<CaseInterface[]> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<CaseInterface[]>(this.apiUrl + '/' + this.openAndInProgressCasesEndpoint, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<CaseInterface[]>(); 
    }
  }

  getCaseOpenedAndInProgressById(caseId: number) : Observable<CaseInterface[]>{
    const token = this.storageService.getToken();
    if(token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<CaseInterface[]>(`${this.apiUrl}/${this.openAndInProgressCasesEndpoint}/${caseId}`, {headers});
    }else{
      console.error("No token found in localStorage");
      return new Observable<CaseInterface[]>();
    }

  }

  deleteCaseById(caseId: number){
    const token = this.storageService.getToken();
    if(token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete(`${this.apiUrl}/${caseId}`, {headers});
    }else{
      console.error("No token found in localStorage");
      return new Observable<CaseInterface[]>();
    }
  }


}
