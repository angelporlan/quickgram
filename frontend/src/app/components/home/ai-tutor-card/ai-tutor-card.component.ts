import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-ai-tutor-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ai-tutor-card.component.html',
    styleUrl: './ai-tutor-card.component.css'
})
export class AiTutorCardComponent implements OnInit {
    stats: any = null;
    usagePercent: number = 0;

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getAiUsage().subscribe({
            next: (data) => {
                this.stats = data;
                this.calculateUsagePercent();
            },
            error: (err) => {
                console.error('Error fetching AI usage stats', err);
            }
        });
    }

    calculateUsagePercent() {
        if (this.stats && this.stats.limit > 0) {
            this.usagePercent = Math.round((this.stats.used / this.stats.limit) * 100);
        } else {
            this.usagePercent = 0;
        }
    }
}
