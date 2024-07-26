import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'token';
  private readonly AUTH_ID_KEY = 'authId';

  constructor() { 
    this.checkTokenExpiry();
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.scheduleTokenRemoval(token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token && this.isTokenExpired(token)) {
      this.clearAuth();
      return null;
    }
    return token;
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

  private scheduleTokenRemoval(token: string): void {
    const expiry = this.getTokenExpiry(token);
    if (expiry) {
      const now = new Date().getTime();
      const timeLeft = expiry * 1000 - now; 
      if (timeLeft > 0) {
        setTimeout(() => {
          this.clearAuth();
        }, timeLeft);
      } else {
        this.clearAuth();
      }
    }
  }

  private checkTokenExpiry(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token && this.isTokenExpired(token)) {
      this.clearAuth();
    } else if (token) {
      this.scheduleTokenRemoval(token);
    }
  }

  private isTokenExpired(token: string): boolean {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) {
      return true;
    }
    return new Date().getTime() > expiry * 1000; 
  }

  private getTokenExpiry(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.exp) {
        return payload.exp;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
