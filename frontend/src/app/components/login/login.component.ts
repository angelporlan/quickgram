import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['angel@example.com', [Validators.required, Validators.email]],
            password: ['123456', [Validators.required]]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    console.log('Login successful');
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Login failed. Please try again.';
                    console.error('Login error:', err);
                }
            });
        }
    }
}
