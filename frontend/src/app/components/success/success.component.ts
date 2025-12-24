import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

@Component({
    selector: 'app-success',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './success.component.html',
    styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
    loading = true;
    verified = false;
    error = false;
    role = '';

    constructor(
        private route: ActivatedRoute,
        private paymentService: PaymentService
    ) { }

    ngOnInit() {
        const sessionId = this.route.snapshot.queryParamMap.get('session_id');

        if (sessionId) {
            this.paymentService.verifySession(sessionId).subscribe({
                next: (response: any) => {
                    this.verified = true;
                    this.role = response.role;
                    this.loading = false;
                },
                error: (err: any) => {
                    console.error('Verification error:', err);
                    this.error = true;
                    this.loading = false;
                }
            });
        } else {
            this.verified = true;
            this.loading = false;
        }
    }
}
