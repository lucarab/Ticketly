import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserResponse } from '../../models/user.model';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers(): Observable<UserResponse[]> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get<UserResponse[]>(`${this.API_URL}/users`, { headers });
  }

  getUsersCount(): Observable<number> {
    return this.getUsers().pipe(map((users) => users.length));
  }

  getUserById(id: number): Observable<UserResponse> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get<UserResponse>(`${this.API_URL}/users/${id}`, { headers });
  }

  updateUser(id: number, payload: Partial<Pick<UserResponse, 'firstname'|'lastname'|'email'|'role'>>): Observable<UserResponse> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.patch<UserResponse>(`${this.API_URL}/users/${id}`, payload, { headers });
  }

  deleteUser(id: number): Observable<{ message: string }> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.delete<{ message: string }>(`${this.API_URL}/users/${id}`, { headers });
  }
}