import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ExerciseResultService } from '../../../services/exercise-result.service';
import { ExerciseService } from '../../../services/exercise.service';

@Component({
    selector: 'app-exercise-results',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './exercise-results.component.html',
    styleUrls: ['./exercise-results.component.css']
})
export class ExerciseResultsComponent implements OnInit {
    result: any;
    exercise: any;
    isAnalyzing = false;
    analysisResult: string | null = null;
    attemptId: number | null = null;

    constructor(
        private resultService: ExerciseResultService,
        private router: Router,
        private location: Location,
        private exerciseService: ExerciseService
    ) { }

    ngOnInit() {
        this.result = this.resultService.getResult();
        this.exercise = this.resultService.getExercise();

        if (this.result && this.result.attemptId) {
            this.attemptId = this.result.attemptId;
        }

        if (!this.result) {
            this.location.back();
        }
    }

    get scorePercentage(): number {
        if (!this.result || !this.result.total_gaps) return 0;
        return Math.round((this.result.score / this.result.total_gaps) * 100);
    }

    explainWithIA() {
        if (!this.attemptId) {
            console.log(this.attemptId);
            alert('No attempt ID found. Please try again.');
            return;
        }

        this.isAnalyzing = true;
        this.analysisResult = null;

        this.exerciseService.explainAttempt(this.attemptId).subscribe({
            next: (res) => {
                this.analysisResult = res.explanation;
                this.isAnalyzing = false;
            },
            error: (err) => {
                console.error('Error fetching explanation:', err);
                this.isAnalyzing = false;
                alert('Error fetching AI explanation.');
            }
        });
    }

    goHome() {
        this.router.navigate(['/']);
    }
}
