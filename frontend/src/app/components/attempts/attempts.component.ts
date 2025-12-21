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
    filteredAttempts: any[] = [];
    loading = true;
    searchTerm: string = '';
    selectedCategory: string = 'Todos';
    selectedDateFilter: string = 'all'; // 'all', 'last30', 'last7', 'today'
    showDateDropdown: boolean = false;

    stats = {
        total: 0,
        average: 0,
        streak: 0
    };

    categories = ['Todos', 'Gramática', 'Vocabulario', 'Lectura', 'Escucha'];

    constructor(private exerciseService: ExerciseService) { }

    ngOnInit() {
        this.exerciseService.getUserAttempts().subscribe({
            next: (data) => {
                this.attempts = data;
                this.filteredAttempts = data;
                this.calculateStats();
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

    calculateStats() {
        if (this.attempts.length === 0) return;

        this.stats.total = this.attempts.length;

        const totalScore = this.attempts.reduce((sum, attempt) => {
            const pct = this.calculatePercentage(attempt.correct_gaps, attempt.total_gaps);
            return sum + pct;
        }, 0);

        this.stats.average = Math.round(totalScore / this.attempts.length);

        // Mock streak calculation based on today
        this.stats.streak = this.calculateStreak();
    }

    calculateStreak(): number {
        // Simple mock: count consecutive days backwards from today? 
        // For MVP, just returning a random or calculated number based on recent activity
        return this.attempts.length > 0 ? Math.min(this.attempts.length, 5) : 0;
    }

    filterAttempts(category: string) {
        this.selectedCategory = category;
        this.applyFilters();
    }

    search(term: string) {
        this.searchTerm = term;
        this.applyFilters();
    }

    setDateFilter(filter: string) {
        this.selectedDateFilter = filter;
        this.showDateDropdown = false;
        this.applyFilters();
    }

    applyFilters() {
        let temp = this.attempts;

        // Date Filter
        if (this.selectedDateFilter !== 'all') {
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            temp = temp.filter(a => {
                const attemptDate = new Date(a.created_at);

                if (this.selectedDateFilter === 'today') {
                    return attemptDate >= todayStart;
                }

                if (this.selectedDateFilter === 'last7') {
                    const sevenDaysAgo = new Date(now);
                    sevenDaysAgo.setDate(now.getDate() - 7);
                    return attemptDate >= sevenDaysAgo;
                }

                if (this.selectedDateFilter === 'last30') {
                    const thirtyDaysAgo = new Date(now);
                    thirtyDaysAgo.setDate(now.getDate() - 30);
                    return attemptDate >= thirtyDaysAgo;
                }

                return true;
            });
        }

        if (this.selectedCategory !== 'Todos') {
            temp = temp.filter(a => {
                const sub = a.exercise.Subcategory?.name || '';
                if (this.selectedCategory === 'Gramática') return sub.includes('Grammar') || sub.includes('Gramática');
                if (this.selectedCategory === 'Vocabulario') return sub.includes('Vocabulary') || sub.includes('Vocabulario');
                if (this.selectedCategory === 'Lectura') return sub.includes('Reading') || sub.includes('Lectura');
                if (this.selectedCategory === 'Escucha') return sub.includes('Listening') || sub.includes('Escucha');
                return true;
            });
        }

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            temp = temp.filter(a => a.exercise.question_text.toLowerCase().includes(term));
        }

        this.filteredAttempts = temp;
    }

    toSlug(text: string): string {
        return text ? text.toLowerCase().replace(/ /g, '-') : '';
    }
}
