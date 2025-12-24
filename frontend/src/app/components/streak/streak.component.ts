import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-streak',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './streak.component.html',
    styleUrl: './streak.component.css'
})
export class StreakComponent implements OnInit {
    dailyGoal = 5;
    numberOfAttempts = 0;
    percentage = 0;
    saving = false;
    originalGoal = 5;

    constructor(private userService: UserService, private router: Router) { }

    ngOnInit() {
        this.userService.getDailyGoalProgress().subscribe({
            next: (data: any) => {
                this.dailyGoal = data.dailyGoal;
                this.originalGoal = data.dailyGoal;
                this.numberOfAttempts = data.numberOfAttempts;
                this.percentage = data.percentage;
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
