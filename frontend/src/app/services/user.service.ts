import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:4000/api';

    private aiUsageCache: any = null;
    private userInfoCache: any = null;

    private dailyGoalUpdatedSubject = new Subject<void>();
    dailyGoalUpdated$ = this.dailyGoalUpdatedSubject.asObservable();

    private userInfoUpdatedSubject = new Subject<void>();
    userInfoUpdated$ = this.userInfoUpdatedSubject.asObservable();

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
        this.userInfoCache = null;
    }

    getUserInfo(): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        if (this.userInfoCache) {
            return of(this.userInfoCache);
        }
        return this.http.get(`${this.apiUrl}/users/me`, { headers }).pipe(
            tap(data => this.userInfoCache = data)
        );
    }

    updateUserInfo(data: any): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.put(`${this.apiUrl}/users/me`, data, { headers });
    }

    updatePassword(data: any): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.put(`${this.apiUrl}/users/me/password`, data, { headers });
    }

    deleteAccount(): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.delete(`${this.apiUrl}/users/me`, { headers });
    }

    getDailyGoalProgress(): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get(`${this.apiUrl}/users/me/numberOfAttemptsToday`, { headers });
    }

    updateDailyGoal(daily_goal: number): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.put(`${this.apiUrl}/users/me/daily-goal`, { daily_goal }, { headers });
    }

    notifyDailyGoalUpdated() {
        this.dailyGoalUpdatedSubject.next();
    }

    notifyUserInfoUpdated() {
        this.userInfoCache = null;
        this.userInfoUpdatedSubject.next();
    }
}
