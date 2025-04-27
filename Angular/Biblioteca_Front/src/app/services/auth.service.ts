import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // URL base de la API de spring boot

  constructor(private http: HttpClient) { }
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, user);
  }
  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, user);
  }
  getUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.id ? user.id : 0;
  }
  logout(): void {
    localStorage.removeItem('user');
    // Redirigir al usuario a la página de inicio de sesión
  }
}
