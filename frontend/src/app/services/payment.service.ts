import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.apiUrl}/api`;

    constructor(private http: HttpClient) { }

    createCheckoutSessionPremium(): Observable<any> {
        return this.http.post(`${this.apiUrl}/create-checkout-session-premium`, {});
    }

    createCheckoutSessionPro(): Observable<any> {
        return this.http.post(`${this.apiUrl}/create-checkout-session-pro`, {});
    }
}
