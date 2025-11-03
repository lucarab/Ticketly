import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface CreateEventRequest {
  name: string;
  location: string;
  datetime: string;
  price: string;
  maxTicketAmount: number;
  description?: string;
  status?: 'draft' | 'published' | 'canceled';
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createEvent(payload: CreateEventRequest): Observable<any> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.post(`${this.API_URL}/events`, payload, { headers });
  }
}