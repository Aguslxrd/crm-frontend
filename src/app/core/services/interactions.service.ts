import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { StorageService } from './storage-service.service';
import { InteractionInterface } from '../interfaces/IInteraction';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/interactions';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  private getHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      console.error('No token found in localStorage');
      return new HttpHeaders();
    }
  }

  getInteractionById(interactionId: number): Observable<InteractionInterface[]> {
    const headers = this.getHeaders();
    if (headers.get('Authorization')) {
      return this.http.get<InteractionInterface[]>(`${this.apiUrl}/${interactionId}`, { headers })
        .pipe(
          catchError(error => {
            console.error('Error fetching interaction by ID:', error);
            return throwError(error);
          })
        );
    } else {
      return throwError('No token found in localStorage');
    }
  }

  saveInteraction(interactionData: InteractionInterface): Observable<InteractionInterface> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<InteractionInterface>(this.apiUrl, interactionData, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<InteractionInterface>();
    }
  }

  getInteractionsByCaseId(caseId: number): Observable<InteractionInterface[]> {
    const headers = this.getHeaders();
    if (headers.get('Authorization')) {
      return this.http.get<InteractionInterface[]>(`${this.apiUrl}/case/${caseId}`, { headers })
        .pipe(
          catchError(error => {
            console.error('Error fetching interactions by case ID:', error);
            return throwError(error);
          })
        );
    } else {
      return throwError('No token found in localStorage');
    }
  }
}
