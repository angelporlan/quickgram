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
    font-family: 'Segoe UI', sans-serif; /* Opcional: fuente más limpia */
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    flex-direction: column;
    gap: 2rem; /* Separa el spinner del texto de forma flexible */
}

.spinner-loader {
    position: relative;
    width: 150px; /* Ligeramente más grande */
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner-ring {
    position: absolute;
    border-radius: 50%;
    border: 2px solid rgba(46, 204, 113, 0.1); /* Anillo base tenue */
    will-change: transform;
}

/* Anillo Exterior */
.spinner-ring:nth-child(1) {
    width: 140px;
    height: 140px;
    border-top: 4px solid #2ecc71;
    border-left: 4px solid transparent; /* Crea un efecto de arco asimétrico */
    box-shadow: 0 0 15px rgba(46, 204, 113, 0.4); /* Glow */
    animation: spin 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

/* Anillo Medio */
.spinner-ring:nth-child(2) {
    width: 100px;
    height: 100px;
    border-top: 4px solid #27ae60;
    border-right: 4px solid transparent;
    box-shadow: 0 0 10px rgba(39, 174, 96, 0.4);
    animation: spin-reverse 1.5s linear infinite; /* Gira al revés */
}

/* Anillo Interior */
.spinner-ring:nth-child(3) {
    width: 60px;
    height: 60px;
    border-top: 4px solid #1e8449;
    border-bottom: 4px solid transparent;
    box-shadow: 0 0 8px rgba(30, 132, 73, 0.4);
    animation: spin 1s linear infinite;
}

/* Núcleo central (punto) */
.spinner-core {
    width: 10px;
    height: 10px;
    background-color: #2ecc71;
    border-radius: 50%;
    box-shadow: 0 0 15px #2ecc71;
    animation: pulse 1s ease-in-out infinite;
}

.loading-text {
    color: #2ecc71;
    font-size: 1rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
    animation: text-blink 1.5s ease-in-out infinite;
    margin: 0; /* El gap del contenedor maneja el espacio */
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes spin-reverse {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
}

@keyframes pulse {
    0%, 100% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 1; }
}

@keyframes text-blink {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; text-shadow: 0 0 20px rgba(46, 204, 113, 0.8); }
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
            // Check for query params first
            this.route.queryParamMap.subscribe(queryParams => {
                const exerciseId = queryParams.get('id');
                if (exerciseId) {
                    this.loadExerciseById(parseInt(exerciseId));
                } else if (subcategory) {
                    this.loadRandomExercise(subcategory);
                }
            });
        });
    }

    loadRandomExercise(subcategory: string) {
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

    loadExerciseById(id: number) {
        this.isLoading = true;
        this.exerciseService.getExerciseById(id).subscribe({
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
