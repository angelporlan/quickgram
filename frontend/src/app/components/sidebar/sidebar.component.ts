import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
    @Input() user: any = {
        username: 'guest',
        name: 'Guest User',
        plan: 'Free',
        coins: 0
    };

    dailyGoal = 5;
    numberOfAttempts = 0;
    percentage = 0;

    private goalUpdateSub?: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.loadDailyGoalProgress();

        this.goalUpdateSub = this.userService.dailyGoalUpdated$.subscribe(() => {
            this.loadDailyGoalProgress();
        });
    }

    ngOnDestroy() {
        this.goalUpdateSub?.unsubscribe();
    }

    private loadDailyGoalProgress() {
        this.userService.getDailyGoalProgress().subscribe({
            next: (data: any) => {
                this.dailyGoal = data.dailyGoal;
                this.numberOfAttempts = data.numberOfAttempts;
                this.percentage = data.percentage;
            },
            error: (err: any) => console.error('Error loading daily goal:', err)
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}

