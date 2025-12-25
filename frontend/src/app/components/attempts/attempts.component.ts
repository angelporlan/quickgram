import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExerciseService } from '../../services/exercise.service';
import { UserService } from '../../services/user.service';

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
    selectedDateFilter: string = 'all';
    showDateDropdown: boolean = false;

    currentPage: number = 1;
    pageSize: number = 20;
    totalPages: number = 1;
    totalAttempts: number = 0;

    stats = {
        total: 0,
        average: 0,
        streak: 0
    };

    categories = ['Todos'];

    constructor(
        private exerciseService: ExerciseService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.exerciseService.getCategories().subscribe({
            next: (cats) => {
                this.categories = ['Todos', ...cats.map(c => c.name)];
            },
            error: (err) => console.error('Error fetching categories', err)
        });

        this.loadGlobalStats();
        this.loadAttempts();
    }

    loadGlobalStats() {
        this.exerciseService.getUserStats().subscribe({
            next: (stats) => {
                this.stats.average = stats.average;
            },
            error: (err) => console.error('Error fetching global stats', err)
        });

        this.userService.getUserInfo().subscribe({
            next: (user) => {
                this.stats.streak = user.streak || 0;
            },
            error: (err) => console.error('Error fetching user info', err)
        });
    }

    loadAttempts() {
        this.loading = true;
        this.exerciseService.getUserAttempts(this.currentPage, this.pageSize, this.selectedCategory).subscribe({
            next: (response) => {
                this.attempts = response.attempts;
                this.filteredAttempts = response.attempts;
                this.totalAttempts = response.pagination.total;
                this.currentPage = response.pagination.page;
                this.totalPages = response.pagination.totalPages;
                this.calculateStats();
                this.applyClientSideFilters();
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
        this.stats.total = this.totalAttempts;

        if (this.attempts.length === 0) {
            this.stats.streak = 0;
            return;
        }

        this.stats.streak = this.calculateStreak();
    }

    calculateStreak(): number {
        return this.attempts.length > 0 ? Math.min(this.attempts.length, 5) : 0;
    }

    filterAttempts(category: string) {
        this.selectedCategory = category;
        this.currentPage = 1;
        this.loadAttempts();
    }

    search(term: string) {
        this.searchTerm = term;
        this.applyClientSideFilters();
    }

    setDateFilter(filter: string) {
        this.selectedDateFilter = filter;
        this.showDateDropdown = false;
        this.applyClientSideFilters();
    }

    applyClientSideFilters() {
        let temp = this.attempts;

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

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            temp = temp.filter(a => a.exercise.question_text.toLowerCase().includes(term));
        }

        this.filteredAttempts = temp;
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadAttempts();
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadAttempts();
        }
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadAttempts();
        }
    }

    getPageNumbers(): number[] {
        const pages: number[] = [];
        const maxVisible = 5;

        if (this.totalPages <= maxVisible) {
            for (let i = 1; i <= this.totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (this.currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push(-1);
                pages.push(this.totalPages);
            } else if (this.currentPage >= this.totalPages - 2) {
                pages.push(1);
                pages.push(-1);
                for (let i = this.totalPages - 3; i <= this.totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push(-1);
                for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) pages.push(i);
                pages.push(-1);
                pages.push(this.totalPages);
            }
        }

        return pages;
    }

    toSlug(text: string): string {
        return text ? text.toLowerCase().replace(/ /g, '-') : '';
    }
}
