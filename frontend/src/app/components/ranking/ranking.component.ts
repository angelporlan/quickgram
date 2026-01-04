import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-ranking',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ranking.component.html',
    styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
    isLoading = true;
    activeTab: 'mostActive' | 'highestAverage' = 'mostActive';

    currentPage = 1;
    pageSize = 20;
    totalItems = 0;
    totalPages = 0;

    rankings: any[] = [];

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.fetchRankings();
    }

    fetchRankings() {
        this.isLoading = true;
        this.userService.getRankings(this.activeTab, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (response) => {
                    this.rankings = response.data;
                    this.totalItems = response.meta.total;
                    this.totalPages = response.meta.totalPages;
                },
                error: (err) => {
                    console.error('Error fetching rankings', err);
                }
            });
    }

    switchTab(tab: 'mostActive' | 'highestAverage') {
        if (this.activeTab !== tab) {
            this.activeTab = tab;
            this.currentPage = 1;
            this.fetchRankings();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.fetchRankings();
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.fetchRankings();
        }
    }

    getAvatarUrl(seed: string): string {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed || 'default'}`;
    }
}
