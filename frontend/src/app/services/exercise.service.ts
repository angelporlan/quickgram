import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {
    private apiUrl = 'http://localhost:4000/api';

    constructor(private http: HttpClient, private authService: AuthService) { }

    getSubcategories(category: string): Observable<any[]> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(`${this.apiUrl}/subcategories?category=${category}`, { headers });
    }
}
