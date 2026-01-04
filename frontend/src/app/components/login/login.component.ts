import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare const google: any;

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    errorMessage: string = '';
    showPassword = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private ngZone: NgZone
    ) {
        this.loginForm = this.fb.group({
            email: ['angel@gmail.com', [Validators.required, Validators.email]],
            password: ['123456', [Validators.required]]
        });
    }

    ngOnInit() {
        this.initializeGoogleSignIn();
    }

    initializeGoogleSignIn() {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: '585513092100-7q8qab80q9q1pjpe1vnq6f4uu49snmlk.apps.googleusercontent.com',
                callback: this.handleGoogleSignIn.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true
            });

            setTimeout(() => {
                const buttonDiv = document.getElementById('googleSignInButton');
                if (buttonDiv) {
                    google.accounts.id.renderButton(
                        buttonDiv,
                        {
                            theme: 'filled_black',
                            size: 'large',
                            width: '100%',
                            text: 'continue_with',
                            shape: 'rectangular'
                        }
                    );
                }
            }, 100);
        }
    }

    handleGoogleSignIn(response: any) {
        this.ngZone.run(() => {
            this.authService.googleLogin(response.credential).subscribe({
                next: () => {
                    console.log('Google login successful');
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Error logging in with Google';
                    console.error('Google login error:', err);
                }
            });
        });
    }

    loginWithGoogle() {
        google.accounts.id.prompt();
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

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
}
