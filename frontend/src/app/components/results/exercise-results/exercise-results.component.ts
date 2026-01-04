import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, RouterLink } from '@angular/router';
import { ExerciseResultService } from '../../../services/exercise-result.service';
import { ExerciseService } from '../../../services/exercise.service';

@Component({
    selector: 'app-exercise-results',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterLink],
    templateUrl: './exercise-results.component.html',
    styleUrls: ['./exercise-results.component.css']
})
export class ExerciseResultsComponent implements OnInit {
    result: any;
    exercise: any;
    isAnalyzing = false;
    analysisResult: string | null = null;
    attemptId: number | null = null;

    structuredExplanation: any = null;
    htmlExplanation: string | null = null;

    constructor(
        private resultService: ExerciseResultService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private exerciseService: ExerciseService
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const attemptIdParam = params.get('attemptId');
            if (attemptIdParam) {
                this.attemptId = +attemptIdParam;

                const storedResult = this.resultService.getResult();
                if (storedResult && storedResult.attemptId === this.attemptId) {
                    this.result = storedResult;
                    this.exercise = this.resultService.getExercise();
                } else {
                    this.loadAttempt(this.attemptId);
                }
            } else {
                this.loadFromService();
            }
        });
    }

    loadFromService() {
        this.result = this.resultService.getResult();
        this.exercise = this.resultService.getExercise();
        if (this.result && this.result.attemptId && !this.attemptId) {
            this.attemptId = this.result.attemptId;
        }

        if (!this.result) {
            this.location.back();
        }
    }

    loadAttempt(id: number) {
        this.exerciseService.getAttempt(id).subscribe({
            next: (data) => {
                this.result = data;
                this.exercise = data.exercise || data.Exercise;

                if (data.AttemptExplanation) {
                    this.processExplanation(data.AttemptExplanation.explanation);
                }

                this.resultService.setResult(this.exercise, this.result, id);
            },
            error: (err) => {
                console.error("Error loading attempt", err);
                this.location.back();
            }
        });
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
        this.structuredExplanation = null;
        this.htmlExplanation = null;

        this.exerciseService.explainAttempt(this.attemptId).subscribe({
            next: (res) => {
                this.processExplanation(res.explanation);
                this.isAnalyzing = false;
            },
            error: (err) => {
                console.error('Error fetching explanation:', err);
                this.isAnalyzing = false;
                alert('Error fetching AI explanation.');
            }
        });
    }

    processExplanation(text: string) {
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? jsonMatch[0] : text;

            this.structuredExplanation = JSON.parse(jsonText);
            this.htmlExplanation = null;
        } catch (e) {
            this.structuredExplanation = null;
            this.htmlExplanation = text;
        }
    }
}
