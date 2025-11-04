import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTickets(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get<any[]>(`${this.API_URL}/tickets`, { headers });
  }

  getTicketById(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get<any>(`${this.API_URL}/tickets/${id}`, { headers });
  }

  getTicketsCount(): Observable<number> {
    return this.getTickets().pipe(map((tickets) => tickets.length));
  }

  updateTicket(id: number, payload: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.patch<any>(`${this.API_URL}/tickets/${id}`, payload, { headers });
  }

  createTicket(payload: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.post<any>(`${this.API_URL}/tickets`, payload, { headers });
  }

  deleteTicket(id: number): Observable<{ deleted: true }> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.delete<{ deleted: true }>(`${this.API_URL}/tickets/${id}`, { headers });
  }

  scanTicketByUuid(uuid: string): Observable<{ valid: boolean; reason?: string; ticket?: any }> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.post<{ valid: boolean; reason?: string; ticket?: any }>(
      `${this.API_URL}/tickets/scan`,
      { uuid },
      { headers }
    );
  }
}