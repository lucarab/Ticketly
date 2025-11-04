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

  getTicketsCount(): Observable<number> {
    return this.getTickets().pipe(map((tickets) => tickets.length));
  }
}