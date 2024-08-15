import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { UserInterface } from '../interfaces/IUser';
import { StorageService } from './storage-service.service';
import { UserResponse } from '../interfaces/IUserResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  // getUsers(): Observable<UserInterface[]> {
  //   const token = this.storageService.getToken();
  //   if (token) {
  //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //     return this.http.get<UserInterface[]>(this.apiUrl, { headers });
  //   } else {
  //     console.error('No token found in localStorage');
  //     return new Observable<UserInterface[]>(); 
  //   }
  // }

  getUsers(page: number, size: number): Observable<UserResponse> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
      return this.http.get<UserResponse>(`${this.apiUrl}`, { headers, params });
    } else {
      console.error('No token found in localStorage');
      return new Observable<UserResponse>();
    }
  }  

  getAllUsers(): Observable<UserResponse> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const params = new HttpParams().set('page', '0').set('size', '1000');
      return this.http.get<UserResponse>(`${this.apiUrl}`, { headers, params });
    } else {
      console.error('No token found in localStorage');
      return new Observable<UserResponse>();
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

  searchUserByIdentifier(identifier: string) : Observable<UserInterface[]>{
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<UserInterface[]>(`${this.apiUrl}/identifier/${identifier}`, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<UserInterface[]>();
    }
  }

  searchUserByPhone(phone: string) : Observable<UserInterface[]>{
    const token = this.storageService.getToken();
    if(token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<UserInterface[]>(`${this.apiUrl}/phone/${phone}`, {headers});
    }else{
      console.error("No token found in localStorage");
      return new Observable<UserInterface[]>();
    }

  }

  searchUserByUserId(userId: number): Observable<UserInterface> {
    const token = this.storageService.getToken();
    if (!token) {
      console.error("No token found in localStorage");
      return throwError(() => new Error("No authentication token available"));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserInterface>(`${this.apiUrl}/${userId}`, { headers }).pipe(
      tap(user => console.log(`Raw response for user ${userId}:`, user)),
      catchError(error => {
        console.error(`Error fetching user with ID ${userId}:`, error);
        return throwError(() => error);
      })
    );
  }
  

  deleteUserById(userId: number){
    const token = this.storageService.getToken();
    if(token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete(`${this.apiUrl}/${userId}`, {headers});
    }else{
      console.error("No token found in localStorage");
      return new Observable<UserInterface[]>();
    }
  }

  getAllUsersCount(): Observable<number> {
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
