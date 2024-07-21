// authentication.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage-service.service';

export interface LoginInterface {
  email: string;
  passwd: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:8080/api/auth/authenticate';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  authenticate(loginData: LoginInterface): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, loginData).pipe(
      tap(response => this.setSession(response))
    );
  }

  private setSession(authResult: AuthResponse) {
    this.storageService.setToken(authResult.token);
    this.storageService.setUserId(authResult.userId);
  }

  logout() {
    this.storageService.clearAuth();
  }

  isLoggedIn(): boolean {
    return !!this.storageService.getToken();
  }

  getToken(): string | null {
    return this.storageService.getToken();
  }

  getUserId(): string | null {
    return this.storageService.getUserId();
  }
}