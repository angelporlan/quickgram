import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'https://quickgram.onrender.com/api';

    private aiUsageCache: any = null;
    private userInfoCache: any = null;
    private userProgressCache: any = null;

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

    getUserProgress(): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        if (this.userProgressCache) {
            return of(this.userProgressCache);
        }
        return this.http.get(`${this.apiUrl}/users/me/progress`, { headers }).pipe(
            tap(data => this.userProgressCache = data)
        );
    }

    clearCache() {
        this.aiUsageCache = null;
        this.userInfoCache = null;
        this.userProgressCache = null;
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

    purchaseAvatar(seed: string): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.post(`${this.apiUrl}/users/me/avatar`, { seed }, { headers });
    }

    getRankings(type: 'mostActive' | 'highestAverage', page: number = 1, limit: number = 20): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get(`${this.apiUrl}/users/rankings`, {
            headers,
            params: {
                type,
                page: page.toString(),
                limit: limit.toString()
            }
        });
    }

    notifyDailyGoalUpdated() {
        this.dailyGoalUpdatedSubject.next();
    }

    notifyUserInfoUpdated() {
        this.userInfoCache = null;
        this.userInfoUpdatedSubject.next();
    }
}
