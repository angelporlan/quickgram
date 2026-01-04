import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

import { LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
    selector: 'app-streak',
    standalone: true,
    imports: [CommonModule, LottieComponent],
    templateUrl: './streak.component.html',
    styleUrl: './streak.component.css'
})
export class StreakComponent implements OnInit {
    dailyGoal = 5;
    numberOfAttempts = 0;
    percentage = 0;
    saving = false;
    originalGoal = 5;
    streak = 0;

    private animationItem: AnimationItem | null = null;
    private starAnimationItem: AnimationItem | null = null;
    private clockAnimationItem: AnimationItem | null = null;

    options: AnimationOptions = {
        path: '/svg-lottie/flame.json',
        loop: false,
        autoplay: true
    };

    starOptions: AnimationOptions = {
        path: '/svg-lottie/star.json',
        loop: false,
        autoplay: true
    };

    clockOptions: AnimationOptions = {
        path: '/svg-lottie/clock.json',
        loop: false,
        autoplay: true
    };

    constructor(
        private userService: UserService,
        private router: Router,
        private ngZone: NgZone
    ) { }


    animationCreated(animationItem: AnimationItem): void {
        this.animationItem = animationItem;
    }

    starAnimationCreated(animationItem: AnimationItem): void {
        this.starAnimationItem = animationItem;
    }

    clockAnimationCreated(animationItem: AnimationItem): void {
        this.clockAnimationItem = animationItem;
    }

    onComplete(): void {
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this.ngZone.run(() => {
                    if (this.animationItem) {
                        this.animationItem.goToAndPlay(0);
                    }
                });
            }, 3000);
        });
    }

    onStarComplete(): void {
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this.ngZone.run(() => {
                    if (this.starAnimationItem) {
                        this.starAnimationItem.goToAndPlay(0);
                    }
                });
            }, 5000);
        });
    }

    onClockComplete(): void {
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this.ngZone.run(() => {
                    if (this.clockAnimationItem) {
                        this.clockAnimationItem.goToAndPlay(0);
                    }
                });
            }, 5000);
        });
    }

    ngOnInit() {
        this.userService.getDailyGoalProgress().subscribe({
            next: (data: any) => {
                this.dailyGoal = data.dailyGoal;
                this.originalGoal = data.dailyGoal;
                this.numberOfAttempts = data.numberOfAttempts;
                this.percentage = data.percentage;
                this.streak = data.streak || 0;
            },
            error: (err: any) => console.error('Error loading daily goal:', err)
        });
    }

    increment() {
        if (this.dailyGoal < 100) {
            this.dailyGoal++;
        }
    }

    decrement() {
        if (this.dailyGoal > 1) {
            this.dailyGoal--;
        }
    }

    get estimatedMinutes(): number {
        return Math.round(this.dailyGoal * 1.5);
    }

    get weeklyExercises(): number {
        return this.dailyGoal * 7;
    }

    saveGoal() {
        this.saving = true;
        this.userService.updateDailyGoal(this.dailyGoal).subscribe({
            next: () => {
                this.originalGoal = this.dailyGoal;
                this.saving = false;
                this.userService.notifyDailyGoalUpdated();
                this.router.navigate(['/']);
            },
            error: (err: any) => {
                console.error('Error saving goal:', err);
                this.saving = false;
            }
        });
    }

    cancel() {
        this.router.navigate(['/']);
    }
}
