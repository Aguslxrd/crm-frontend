import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage-service.service';
import { EnterprisesInterface } from '../interfaces/IEnterprises';
import { Observable } from 'rxjs';
import { UserEnterpriseInterface } from '../interfaces/IUser-Enterprise';
import { UserEnterpriseAssociation } from '../interfaces/IUserEnterpriseAssociation';
import { CaseInterface } from '../interfaces/ICase';
import { EnterpriseResponse } from '../interfaces/IEnterpriseResponse';

@Injectable({
  providedIn: 'root'
})
export class EnterprisesService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/enterprises';
  private readonly apiUrlEnterpriseUser = 'http://localhost:8080/api/v1/user-enterprises';

  constructor(private http: HttpClient, private storageService: StorageService) {}


  getEnterpriseByEnterpriseId(enterpriseId: number): Observable<EnterprisesInterface> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<EnterprisesInterface>(`${this.apiUrl}/${enterpriseId}`, { headers });
    }
    console.error('No token found in localStorage');
    return new Observable<EnterprisesInterface>();
  }

  saveEnterprise(enterpriseData: EnterprisesInterface): Observable<EnterprisesInterface> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<EnterprisesInterface>(this.apiUrl, enterpriseData, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<EnterprisesInterface>();
    }
  }

  getEnterprises(page: number, size: number): Observable<EnterpriseResponse> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
      return this.http.get<EnterpriseResponse>(`${this.apiUrl}`, { headers, params });
    } else {
      console.error('No token found in localStorage');
      return new Observable<EnterpriseResponse>();
    }
  }  


  getEnterprisesByName(enterpriseName: string) : Observable<EnterprisesInterface[]>{
    const token = this.storageService.getToken();

    if(token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<EnterprisesInterface[]>(`${this.apiUrl}/name/${enterpriseName}`, { headers });
    }
    console.error('No token found in localStorage');
    return new Observable<EnterprisesInterface[]>();
  }

  getEnterpriseByRut(enterpriseRut: string) : Observable<EnterprisesInterface[]>{
    const token = this.storageService.getToken();

    if(token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<EnterprisesInterface[]>(`${this.apiUrl}/rut/${enterpriseRut}`, { headers });
    }
    console.error('No token found in localStorage');
    return new Observable<EnterprisesInterface[]>();
  }

  deleteEnterpriseById(enterpriseId: number){
    const token = this.storageService.getToken();
    if(token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete(`${this.apiUrl}/${enterpriseId}`, {headers});
    }else{
      console.error("No token found in localstorage");
      return new Observable<CaseInterface[]>();
    }
  }

  deleteUserAssignedToEnterpriseById(userId: number,enterpriseId: number){
    const token = this.storageService.getToken();
    if(token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete(`${this.apiUrlEnterpriseUser}/${userId}/${enterpriseId}`, {headers});
    }else{
      console.error("No token found in localstorage");
      return new Observable<CaseInterface[]>();
    }
  }

  getEnterpriseByEmail(enterpriseEmail: string) : Observable<EnterprisesInterface[]>{
    const token = this.storageService.getToken();

    if(token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<EnterprisesInterface[]>(`${this.apiUrl}/email/${enterpriseEmail}`, { headers });
    }
    console.error('No token found in localStorage');
    return new Observable<EnterprisesInterface[]>();
  }

  getEnterpriseByPhone(enterprisePhone: string) : Observable<EnterprisesInterface[]>{
    const token = this.storageService.getToken();

    if(token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<EnterprisesInterface[]>(`${this.apiUrl}/phone/${enterprisePhone}`, { headers });
    }
    console.error('No token found in localStorage');
    return new Observable<EnterprisesInterface[]>();
  }

  getUserEnterprise(userId: number): Observable<UserEnterpriseInterface[]> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<UserEnterpriseInterface[]>(`${this.apiUrlEnterpriseUser}/user/${userId}`, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<UserEnterpriseInterface[]>();
    }
  }

  saveUserEnterprise(userEnterpriseData: UserEnterpriseAssociation): Observable<UserEnterpriseAssociation> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<UserEnterpriseAssociation>(this.apiUrlEnterpriseUser, userEnterpriseData, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<UserEnterpriseAssociation>();
    }
  }

  getAllEnterprisesCount(): Observable<number> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<number>(`${this.apiUrl}/all`, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<number>();
    }
  }

}
