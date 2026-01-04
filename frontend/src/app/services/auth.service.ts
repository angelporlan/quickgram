import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:4000/api';
    private tokenKey = 'quickgram_token';

    constructor(private http: HttpClient) { }

    login(credentials: any): Observable<any> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response.token) {
                    this.saveToken(response.token);
                }
            })
        );
    }

    register(userData: any): Observable<any> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/register`, userData).pipe(
            tap(response => {
                if (response.token) {
                    this.saveToken(response.token);
                }
            })
        );
    }

    googleLogin(credential: string): Observable<any> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/auth/google`, { credential }).pipe(
            tap(response => {
                if (response.token) {
                    this.saveToken(response.token);
                }
            })
        );
    }

    saveToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
