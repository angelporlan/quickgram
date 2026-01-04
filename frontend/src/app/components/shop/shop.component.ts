import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  user: any = null;
  previewSeed: string = '';
  avatarCost = 50;
  isLoadingAvatar = false;
  avatarErrorMsg = '';
  avatarSuccessMsg = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.userService.getUserInfo().subscribe(user => {
      this.user = user;
      this.previewSeed = this.generateRandomSeed();
    });
  }

  generateRandomSeed(): string {
    return Math.random().toString(36).substring(7);
  }

  randomizeAvatar() {
    this.previewSeed = this.generateRandomSeed();
    this.avatarSuccessMsg = '';
    this.avatarErrorMsg = '';
  }

  buyAvatar() {
    if (!this.user) return;

    if (this.user.coins < this.avatarCost) {
      this.avatarErrorMsg = 'No tienes suficientes monedas';
      return;
    }

    this.isLoadingAvatar = true;
    this.avatarErrorMsg = '';
    this.avatarSuccessMsg = '';

    this.userService.purchaseAvatar(this.previewSeed).subscribe({
      next: (res: any) => {
        this.isLoadingAvatar = false;
        this.user.coins = res.coins;
        this.user.avatar_seed = res.avatar_seed;
        this.avatarSuccessMsg = '¡Avatar comprado y actualizado!';
        this.userService.notifyUserInfoUpdated();
      },
      error: (err) => {
        this.isLoadingAvatar = false;
        console.error('Error buying avatar', err);
        this.avatarErrorMsg = err.error?.message || 'Error al comprar el avatar';
      }
    });
  }
}
