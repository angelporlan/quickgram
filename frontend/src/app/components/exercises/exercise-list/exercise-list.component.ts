import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';

@Component({
    selector: 'app-exercise-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './exercise-list.component.html',
    styleUrls: ['./exercise-list.component.css']
})
export class ExerciseListComponent implements OnInit {
    exercises: any[] = [];
    subcategory: string = '';
    isLoading: boolean = true;
    currentPage: number = 1;
    totalPages: number = 1;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private exerciseService: ExerciseService
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.subcategory = params.get('subcategory') || '';
            if (this.subcategory) {
                this.loadExercises();
            }
        });
    }

    loadExercises(page: number = 1) {
        this.isLoading = true;
        this.exerciseService.getExercises({
            subcategory: this.subcategory,
            level: 'B2', // Hardcoded for now as per requirements/context
            page: page,
            limit: 10
        }).subscribe({
            next: (data) => {
                this.exercises = data.exercises;
                this.totalPages = data.totalPages;
                this.currentPage = data.currentPage;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading exercises', err);
                this.isLoading = false;
            }
        });
    }

    onExerciseClick(exercise: any) {
        this.router.navigate(['/exercise', this.subcategory], { queryParams: { id: exercise.id } });
    }

    changePage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.loadExercises(page);
        }
    }

    goBack() {
        this.router.navigate(['/categories']);
    }
}
