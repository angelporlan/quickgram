import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:4000/api';

    private aiUsageCache: any = null;

    constructor(private http: HttpClient, private authService: AuthService) { }

    getAiUsage(): Observable<any> {
        if (this.aiUsageCache) {
            return of(this.aiUsageCache);
        }

        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.apiUrl}/users/me/ai-usage`, { headers }).pipe(
            tap(data => this.aiUsageCache = data)
        );
    }

    clearCache() {
        this.aiUsageCache = null;
    }
}
