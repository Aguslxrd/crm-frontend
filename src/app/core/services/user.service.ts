import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInterface } from '../interfaces/IUser';
import { StorageService } from './storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  getUsers(): Observable<UserInterface[]> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<UserInterface[]>(this.apiUrl, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<UserInterface[]>(); 
    }
  }

  saveUser(user: UserInterface): Observable<UserInterface> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<UserInterface>(this.apiUrl, user, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<UserInterface>();
    }
  }

  searchUsersByEmail(email: string): Observable<UserInterface[]> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<UserInterface[]>(`${this.apiUrl}/email/${email}`, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<UserInterface[]>();
    }
  }

}
