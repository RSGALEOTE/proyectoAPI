import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://api.escuelajs.co/api/v1';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { email, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, body, { headers }).pipe(
      switchMap((response: LoginResponse) => {
        localStorage.setItem('token', response.access_token);
        return this.getUserProfile(email);
      })
    );
  }

  getUserProfile(email: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      switchMap(users => {
        if (users.length > 0) {
          const user = users[0];
          localStorage.setItem('userId', user.id.toString());
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userAvatar', user.avatar);
          localStorage.setItem('userRole', user.role);
          return [user];
        }
        throw new Error('Usuario no encontrado');
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
  }
}