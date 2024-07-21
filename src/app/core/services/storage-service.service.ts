import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'token';
  private readonly AUTH_ID_KEY = 'authId';

  constructor() { }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setUserId(authId: string): void {
    localStorage.setItem(this.AUTH_ID_KEY, authId);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.AUTH_ID_KEY);
  }

  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.AUTH_ID_KEY);
  }
}