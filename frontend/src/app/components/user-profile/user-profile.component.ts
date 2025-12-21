import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  loading = true;

  // Edit modes
  editingName = false;
  editingUsername = false;
  editingPassword = false;

  // Form data
  nameForm = { name: '' };
  usernameForm = { username: '' };
  passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };

  // Delete confirmation
  showDeleteConfirm = false;
  deleteConfirmText = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.userService.getUserInfo().subscribe({
      next: (data) => {
        this.user = data;
        this.nameForm.name = data.name;
        this.usernameForm.username = data.username;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user data', err);
        this.loading = false;
      }
    });
  }

  updateName() {
    this.userService.updateUserInfo({ name: this.nameForm.name }).subscribe({
      next: () => {
        this.user.name = this.nameForm.name;
        this.editingName = false;
      },
      error: (err) => console.error('Error updating name', err)
    });
  }

  updateUsername() {
    this.userService.updateUserInfo({ username: this.usernameForm.username }).subscribe({
      next: () => {
        this.user.username = this.usernameForm.username;
        this.editingUsername = false;
      },
      error: (err) => console.error('Error updating username', err)
    });
  }

  updatePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.userService.updatePassword({
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    }).subscribe({
      next: () => {
        this.editingPassword = false;
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
        alert('Contraseña actualizada correctamente');
      },
      error: (err) => {
        console.error('Error updating password', err);
        alert('Error al actualizar la contraseña');
      }
    });
  }

  deleteAccount() {
    if (this.deleteConfirmText !== this.user.username) {
      alert('El nombre de usuario no coincide');
      return;
    }

    this.userService.deleteAccount().subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error deleting account', err);
        alert('Error al eliminar la cuenta');
      }
    });
  }

  cancelEdit(field: string) {
    if (field === 'name') {
      this.editingName = false;
      this.nameForm.name = this.user.name;
    } else if (field === 'username') {
      this.editingUsername = false;
      this.usernameForm.username = this.user.username;
    } else if (field === 'password') {
      this.editingPassword = false;
      this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
    }
  }
}
