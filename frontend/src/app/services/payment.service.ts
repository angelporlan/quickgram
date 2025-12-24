import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.apiUrl}/api`;

    constructor(private http: HttpClient) { }

    private getHeaders() {
        const token = localStorage.getItem('quickgram_token');
        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            })
        };
    }

    createCheckoutSessionPremium(): Observable<any> {
        return this.http.post(`${this.apiUrl}/create-checkout-session-premium`, {}, this.getHeaders());
    }

    createCheckoutSessionPro(): Observable<any> {
        return this.http.post(`${this.apiUrl}/create-checkout-session-pro`, {}, this.getHeaders());
    }

    verifySession(sessionId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/payments/verify-session`, { sessionId });
    }
}
