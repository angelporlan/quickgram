import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    password: string = '';
    confirmPassword: string = '';
    token: string = '';
    message: string = '';
    error: string = '';
    isLoading: boolean = false;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.token = this.route.snapshot.paramMap.get('token') || '';
        if (!this.token) {
            this.error = 'Enlace inválido o expirado.';
        }
    }

    onSubmit() {
        if (!this.password || !this.confirmPassword) {
            this.error = 'Por favor completa todos los campos.';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.error = 'Las contraseñas no coinciden.';
            return;
        }

        if (this.password.length < 6) {
            this.error = 'La contraseña debe tener al menos 6 caracteres.';
            return;
        }

        this.isLoading = true;
        this.message = '';
        this.error = '';

        this.authService.resetPassword(this.token, this.password).subscribe({
            next: (res) => {
                this.message = res.message;
                this.isLoading = false;
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000);
            },
            error: (err) => {
                this.error = err.error?.message || 'Error al restablecer la contraseña.';
                this.isLoading = false;
            }
        });
    }
}
