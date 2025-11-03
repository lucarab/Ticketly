import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginRequest, LoginResponse, UserResponse, AuthState } from './auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000';
  private readonly TOKEN_KEY = 'ticketly_token';
  private readonly USER_KEY = 'ticketly_user';

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  public authState$ = this.authStateSubject.asObservable();

  public isAuthenticated = signal(false);
  public currentUser = signal<UserResponse | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UserResponse;
        this.updateAuthState(true, user, token);
      } catch (error) {
        console.error('Fehler beim Parsen der gespeicherten Benutzerdaten:', error);
        this.clearAuthState();
      }
    }
  }

  
  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, loginData)
      .pipe(
        tap(response => {
          this.handleLoginSuccess(response);
        }),
        catchError(this.handleError)
      );
  }

  
  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  
  getCurrentUser(): UserResponse | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr) as UserResponse;
      } catch (error) {
        console.error('Fehler beim Parsen der Benutzerdaten:', error);
        return null;
      }
    }
    return null;
  }

  
  private handleLoginSuccess(response: LoginResponse): void {
    const { user, access_token } = response;
    
    
    localStorage.setItem(this.TOKEN_KEY, access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    
    this.updateAuthState(true, user, access_token);
  }

  
  private updateAuthState(isAuthenticated: boolean, user: UserResponse | null, token: string | null): void {
    const newState: AuthState = {
      isAuthenticated,
      user,
      token
    };
    
    this.authStateSubject.next(newState);
    this.isAuthenticated.set(isAuthenticated);
    this.currentUser.set(user);
  }

  
  private clearAuthState(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.updateAuthState(false, null, null);
  }

  
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Fehler beim Parsen des Tokens:', error);
      return true;
    }
  }

  
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ein unbekannter Fehler ist aufgetreten';
    
    if (error.error instanceof ErrorEvent) {
      
      errorMessage = `Fehler: ${error.error.message}`;
    } else {
      
      switch (error.status) {
        case 401:
          errorMessage = 'Ungültige Anmeldedaten. Bitte überprüfe deine E-Mail-Adresse und dein Passwort.';
          break;
        case 400:
          errorMessage = 'Ungültige Eingaben. Bitte überprüfen deine Daten.';
          break;
        case 500:
          errorMessage = 'Serverfehler. Bitte versuche es später erneut.';
          break;
        case 0:
          errorMessage = 'Verbindung zum Server fehlgeschlagen.';
          break;
        default:
          errorMessage = `Fehler ${error.status}: ${error.error?.message || 'Unbekannter Fehler'}`;
      }
    }
    
    console.error('Authentication error:', error);
    return throwError(() => new Error(errorMessage));
  };

  updatePassword(payload: { currentPassword: string; newPassword: string }): Observable<{ message: string }> {
    const token = this.getToken();
    return this.http
      .put<{ message: string }>(`${this.API_URL}/users/password`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      .pipe(catchError(this.handleError));
  }

  deleteAccount(): Observable<{ message: string }> {
    const token = this.getToken();
    return this.http
      .delete<{ message: string }>(`${this.API_URL}/users/account`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      .pipe(catchError(this.handleError));
  }
}