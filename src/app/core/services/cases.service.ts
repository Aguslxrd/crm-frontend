import { Injectable } from '@angular/core';
import { StorageService } from './storage-service.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { CaseInterface } from '../interfaces/ICase';
import { CaseResponse } from '../interfaces/ICaseResponse';
import { environment } from '../../../environment.dev';

@Injectable({
  providedIn: 'root'
})
export class CasesService {
  
  private readonly apiUrl = `${environment.apiUrl}/cases`;
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

  getOpenAndInProgressCases(page: number, size: number): Observable<CaseResponse> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
      return this.http.get<CaseResponse>(`${this.apiUrl}/${this.openAndInProgressCasesEndpoint}`, { headers, params });
    } else {
      console.error('No token found in localStorage');
      return new Observable<CaseResponse>();
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
  
  getAllCasesCount(): Observable<number> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<number>(`${this.apiUrl}/all`, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<number>();
    }
  }

  getAllOpenedCasesCount(): Observable<number> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<number>(`${this.apiUrl}/all/opened`, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<number>();
    }
  }

  getAllInProgressCasesCount(): Observable<number> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<number>(`${this.apiUrl}/all/inprogress`, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<number>();
    }
  }

}
