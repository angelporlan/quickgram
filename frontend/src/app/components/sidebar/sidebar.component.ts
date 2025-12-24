import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
    @Input() user: any = {
        username: 'guest',
        name: 'Guest User',
        plan: 'Free'
    };

    dailyGoal = 5;
    numberOfAttempts = 0;
    percentage = 0;

    constructor(
        private authService: AuthService,
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userService.getDailyGoalProgress().subscribe({
            next: (data) => {
                this.dailyGoal = data.dailyGoal;
                this.numberOfAttempts = data.numberOfAttempts;
                this.percentage = data.percentage;
            },
            error: (err) => console.error('Error loading daily goal:', err)
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
