import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare const google: any;

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    errorMessage: string = '';
    showPassword = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private ngZone: NgZone
    ) {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
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
                const buttonDiv = document.getElementById('googleSignInButtonRegister');
                if (buttonDiv) {
                    google.accounts.id.renderButton(
                        buttonDiv,
                        {
                            theme: 'filled_black',
                            size: 'large',
                            width: '100%',
                            text: 'signup_with',
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
                    console.log('Google registration successful');
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Error al registrarse con Google';
                    console.error('Google registration error:', err);
                }
            });
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
                    console.error('Registration error:', err);
                }
            });
        }
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
}
