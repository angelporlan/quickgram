import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { ExerciseResultService } from '../../../services/exercise-result.service';
import { MultipleChoiceComponent } from '../multiple-choice/multiple-choice.component';
import { ConditionalsComponent } from '../conditionals/conditionals.component';
import { VocabularyComponent } from '../vocabulary/vocabulary.component';
import { GapFillComponent } from '../gap-fill/gap-fill.component';
import { WordFormationComponent } from '../word-formation/word-formation.component';
import { KeyWordTransformationComponent } from '../key-word-transformation/key-word-transformation.component';
import { EssayComponent } from '../essay/essay.component';
import { ReadingMultipleChoiceComponent } from '../reading-multiple-choice/reading-multiple-choice.component';
import { GappedTextComponent } from '../gapped-text/gapped-text.component';
import { MultipleMatchingComponent } from '../multiple-matching/multiple-matching.component';

@Component({
    selector: 'app-exercise-page',
    standalone: true,
    imports: [CommonModule, MultipleChoiceComponent, ConditionalsComponent, VocabularyComponent, GapFillComponent, WordFormationComponent, KeyWordTransformationComponent, EssayComponent, ReadingMultipleChoiceComponent, GappedTextComponent, MultipleMatchingComponent],
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

        let exerciseType = (data.exercise.type || 'multiple-choice').replace(/_/g, '-');

        if (exerciseType === 'reading-multiple-choice') {
            exerciseType = 'multiple-choice-reading';
        }

        if (exerciseType === 'reading-gapped-text') {
            exerciseType = 'gapped-text';
        }

        if (exerciseType === 'reading-multiple-matching') {
            exerciseType = 'multiple-matching';
        }

        this.router.navigate(['/results', data.attemptId, exerciseType]);
    }
}
