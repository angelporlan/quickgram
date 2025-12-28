import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExerciseService } from '../../../services/exercise.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-gap-fill',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './gap-fill.component.html',
    styleUrls: ['./gap-fill.component.css']
})
export class GapFillComponent implements OnInit {
    @Input() exercise: any;
    @Output() close = new EventEmitter<void>();
    @Output() attemptSubmitted = new EventEmitter<any>();

    parsedAnswers: any = {};
    textParts: any[] = [];

    currentGapId: number | null = null;
    userAnswers = new Map<number, string>();
    totalGaps = 0;
    answeredGaps = 0;

    constructor(
        private exerciseService: ExerciseService
    ) { }

    ngOnInit() {
        if (this.exercise) {
            this.initializeExercise();
        }
    }

    initializeExercise() {
        try {
            this.parsedAnswers = JSON.parse(this.exercise.correct_answer);
            this.processText(this.exercise.question_text);

            if (this.totalGaps > 0) {
                this.selectGap(1);
            }
        } catch (e) {
            console.error('Error parsing exercise data', e);
        }
    }

    processText(text: string) {
        const regex = /\((\d+)\)[.…]*/g;

        let lastIndex = 0;
        let match;
        this.textParts = [];
        const gapIds = new Set<number>();

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                this.textParts.push({
                    type: 'text',
                    content: text.substring(lastIndex, match.index)
                });
            }

            const gapId = parseInt(match[1]);
            gapIds.add(gapId);
            this.textParts.push({
                type: 'gap',
                id: gapId,
                content: match[0]
            });

            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            this.textParts.push({
                type: 'text',
                content: text.substring(lastIndex)
            });
        }

        this.totalGaps = gapIds.size;
    }

    selectGap(id: number) {
        this.currentGapId = id;
    }

    onAnswerInput(value: string) {
        if (this.currentGapId === null) return;

        if (value.trim()) {
            this.userAnswers.set(this.currentGapId, value.trim());
        } else {
            this.userAnswers.delete(this.currentGapId);
        }
        this.answeredGaps = this.userAnswers.size;
    }

    onAnswerKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && this.currentAnswer.trim()) {
            event.preventDefault();
            this.moveToNextGap();
        }
    }

    moveToNextGap() {
        if (this.currentGapId === null) return;

        const nextGapId = this.currentGapId + 1;
        if (nextGapId <= this.totalGaps) {
            this.selectGap(nextGapId);
        }
    }

    get currentAnswer(): string {
        if (!this.currentGapId) return '';
        return this.userAnswers.get(this.currentGapId) || '';
    }

    get progressPercentage(): number {
        return this.totalGaps > 0 ? (this.answeredGaps / this.totalGaps) * 100 : 0;
    }

    get allQuestionsAnswered(): boolean {
        return this.answeredGaps === this.totalGaps && this.totalGaps > 0;
    }

    submit() {
        if (!this.allQuestionsAnswered) return;

        let correctCount = 0;
        const userAnswerObj: any = {};

        this.userAnswers.forEach((answer, gapId) => {
            userAnswerObj[gapId] = answer;
            const correctAnswer = this.parsedAnswers[gapId];

            if (correctAnswer) {
                const correctOptions = correctAnswer.split('/').map((opt: string) => opt.trim().toLowerCase());
                const userAnswerLower = answer.toLowerCase();

                if (correctOptions.includes(userAnswerLower)) {
                    correctCount++;
                }
            }
        });

        const payload = {
            user_answer: userAnswerObj,
            total_gaps: this.totalGaps,
            correct_gaps: correctCount,
            is_fully_correct: correctCount === this.totalGaps,
            score: correctCount
        };

        console.log('Submitting attempt:', payload);

        this.exerciseService.submitAttempt(this.exercise.id, payload).subscribe({
            next: (res) => {
                console.log('Submission successful', res);
                const attemptId = res.attempt.id;
                console.log('Attempt ID:', attemptId);

                this.attemptSubmitted.emit({
                    exercise: this.exercise,
                    result: payload,
                    attemptId: attemptId
                });
            },
            error: (err) => {
                console.error('Submission failed', err);
                alert('Error al enviar la respuesta.');
            }
        });
    }
}
