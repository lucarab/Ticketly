import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getEvents(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get<any[]>(`${this.API_URL}/events`, { headers });
  }

  getEventById(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get<any>(`${this.API_URL}/events/${id}`, { headers });
  }

  updateEvent(id: number, payload: Partial<CreateEventRequest>): Observable<any> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.patch<any>(`${this.API_URL}/events/${id}`, payload, { headers });
  }

  deleteEvent(id: number): Observable<{ deleted: true }> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.delete<{ deleted: true }>(`${this.API_URL}/events/${id}`, { headers });
  }

  getEventsCount(): Observable<number> {
    return this.getEvents().pipe(map((events) => events.length));
  }

  getPublishedEventsCount(): Observable<number> {
    return this.getEvents().pipe(
      map((events) => events.filter((e) => e?.status === 'published').length)
    );
  }
}