import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {
    private apiUrl = 'http://localhost:4000/api';
    private cache = new Map<string, any[]>();
    private cacheCategories = new Map<string, any[]>();

    constructor(private http: HttpClient, private authService: AuthService, private userService: UserService) { }

    getCategories(): Observable<any[]> {
        if (this.cacheCategories.has('categories')) {
            return of(this.cacheCategories.get('categories')!);
        }

        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<any[]>(`${this.apiUrl}/categories`, { headers }).pipe(
            tap(data => this.cacheCategories.set('categories', data))
        );
    }

    getSubcategories(category: string): Observable<any[]> {
        if (this.cache.has(category)) {
            return of(this.cache.get(category)!);
        }

        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(`${this.apiUrl}/subcategories?category=${category}`, { headers }).pipe(
            tap(data => this.cache.set(category, data))
        );
    }
    getRandomExercise(level: string, subcategory: string): Observable<any[]> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(`${this.apiUrl}/exercises?level=${level}&subcategory=${subcategory}&random=true`, { headers });
    }

    submitAttempt(exerciseId: number, attemptData: any): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(`${this.apiUrl}/exercises/${exerciseId}/attempt`, attemptData, { headers }).pipe(
            tap(() => this.userService.notifyUserInfoUpdated())
        );
    }

    explainAttempt(attemptId: number): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(`${this.apiUrl}/attempts/${attemptId}/explain`, {}, { headers });
    }

    getAttempt(attemptId: number): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.apiUrl}/attempts/${attemptId}`, { headers });
    }

    getUserAttempts(): Observable<any[]> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(`${this.apiUrl}/attempts`, { headers });
    }
}
