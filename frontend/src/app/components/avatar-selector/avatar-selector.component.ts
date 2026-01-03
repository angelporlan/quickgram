import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avatar-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.css']
})
export class AvatarSelectorComponent {
  @Input() currentSeed: string = '';
  @Input() userCoins: number = 0;
  @Output() close = new EventEmitter<void>();
  @Output() avatarUpdated = new EventEmitter<void>();

  previewSeed: string = '';
  cost = 50;
  isLoading = false;
  errorMsg = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.previewSeed = this.currentSeed || this.generateRandomSeed();
  }

  generateRandomSeed(): string {
    return Math.random().toString(36).substring(7);
  }

  randomize() {
    this.previewSeed = this.generateRandomSeed();
  }

  save() {
    if (this.userCoins < this.cost) {
      this.errorMsg = 'No tienes suficientes monedas';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.userService.purchaseAvatar(this.previewSeed).subscribe({
      next: () => {
        this.isLoading = false;
        this.userService.notifyUserInfoUpdated();
        this.avatarUpdated.emit();
        this.close.emit();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error buying avatar', err);
        this.errorMsg = err.error?.message || 'Error al comprar el avatar';
      }
    });
  }

  cancel() {
    this.close.emit();
  }
}
