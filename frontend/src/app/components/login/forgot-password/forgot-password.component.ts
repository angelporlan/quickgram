import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    email: string = '';
    message: string = '';
    error: string = '';
    isLoading: boolean = false;

    constructor(private authService: AuthService) { }

    onSubmit() {
        if (!this.email) return;

        this.isLoading = true;
        this.message = '';
        this.error = '';

        this.authService.forgotPassword(this.email).subscribe({
            next: (res) => {
                this.message = res.message;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = err.error?.message || 'Something went wrong. Please try again.';
                this.isLoading = false;
            }
        });
    }
}
