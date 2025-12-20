import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { ExerciseResultService } from '../../../services/exercise-result.service';
import { MultipleChoiceComponent } from '../multiple-choice/multiple-choice.component';

@Component({
    selector: 'app-exercise-page',
    standalone: true,
    imports: [CommonModule, MultipleChoiceComponent],
    templateUrl: './exercise-page.component.html',
    styles: [`
    :host {
        display: block;
        width: 100vw;
        height: 100vh;
        background-color: #0e1515;
    }
    .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        color: #2ecc71;
    }
  `]
})
export class ExercisePageComponent implements OnInit {
    exercise: any = null;
    isLoading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private exerciseService: ExerciseService,
        private location: Location,
        private resultService: ExerciseResultService
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const subcategory = params.get('subcategory');
            if (subcategory) {
                this.loadExercise(subcategory);
            }
        });
    }

    loadExercise(subcategory: string) {
        this.isLoading = true;
        this.exerciseService.getRandomExercise('B2', subcategory).subscribe({
            next: (data) => {
                this.exercise = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading exercise:', err);
                this.isLoading = false;
                alert('Error loading exercise');
                this.goBack();
            }
        });
    }

    goBack() {
        this.location.back();
    }

    handleAttemptSubmission(data: any) {
        this.resultService.setResult(data.exercise, data.result, data.attemptId);
        this.router.navigate(['/results/multiple-choice']);
    }
}
