import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
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
    totalExercises: number = 0;
    percentageCompleted: number = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private exerciseService: ExerciseService,
        private location: Location
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
                console.log(data);
                this.totalPages = data.totalPages;
                this.currentPage = data.currentPage;
                this.totalExercises = data.totalItems;

                const totalCompleted = data.totalCompleted || 0;
                this.percentageCompleted = this.totalExercises > 0 ? Math.round((totalCompleted / this.totalExercises) * 100) : 0;

                this.exercises = data.exercises.map((exercise: any, index: number) => {
                    const globalIndex = (this.currentPage - 1) * 10 + index + 1;
                    const isLocked = !exercise.isCompleted && globalIndex > totalCompleted + 1;

                    return {
                        ...exercise,
                        fictitious_id: (this.currentPage - 1) * 10 + index + 1,
                        isLocked: isLocked
                    };
                });
                this.isLoading = false;
                console.log(this.exercises);
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
        this.location.back();
    }
}
