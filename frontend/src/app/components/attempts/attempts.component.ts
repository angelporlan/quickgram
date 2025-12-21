import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExerciseService } from '../../services/exercise.service';

@Component({
    selector: 'app-attempts',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './attempts.component.html',
    styleUrls: ['./attempts.component.css']
})
export class AttemptsComponent implements OnInit {
    attempts: any[] = [];
    loading = true;

    constructor(private exerciseService: ExerciseService) { }

    ngOnInit() {
        this.exerciseService.getUserAttempts().subscribe({
            next: (data) => {
                this.attempts = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching attempts', error);
                this.loading = false;
            }
        });
    }

    getScoreColor(score: number): string {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    }

    calculatePercentage(correct: number, total: number): number {
        if (!total || total === 0) return 0;
        return Math.round((correct / total) * 100);
    }

    toSlug(text: string): string {
        return text ? text.toLowerCase().replace(/ /g, '-') : '';
    }
}
