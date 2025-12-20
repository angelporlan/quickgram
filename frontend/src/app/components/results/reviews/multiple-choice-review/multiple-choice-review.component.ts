import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseResultService } from '../../../../services/exercise-result.service';

@Component({
    selector: 'app-multiple-choice-review',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './multiple-choice-review.component.html',
    styleUrls: ['./multiple-choice-review.component.css']
})
export class MultipleChoiceReviewComponent implements OnInit {
    result: any;
    exercise: any;
    processedQuestions: any[] = [];

    constructor(private resultService: ExerciseResultService) { }

    ngOnInit() {
        // Subscribe to changes in the service
        this.resultService.exercise$.subscribe(exercise => {
            this.exercise = exercise;
            if (this.exercise && this.result) {
                this.processReview();
            }
        });

        this.resultService.result$.subscribe(result => {
            this.result = result;
            if (this.exercise && this.result) {
                this.processReview();
            }
        });
    }

    processReview() {
        const parsedQuestionText = this.exercise.question_text;
        let parsedCorrectAnswers = this.exercise.correct_answer;
        let parsedUserAnswers = this.result.user_answer;

        if (typeof parsedCorrectAnswers === 'string') {
            try {
                parsedCorrectAnswers = JSON.parse(parsedCorrectAnswers);
            } catch (e) {
                console.error("Error parsing correct_answer", e);
                parsedCorrectAnswers = {};
            }
        }

        if (typeof parsedUserAnswers === 'string') {
            try {
                parsedUserAnswers = JSON.parse(parsedUserAnswers);
            } catch (e) {
                console.error("Error parsing user_answer", e);
                parsedUserAnswers = {};
            }
        }

        this.processedQuestions = [];
        const gapIds = Object.keys(parsedCorrectAnswers).map(k => parseInt(k)).sort((a, b) => a - b);

        for (const gapId of gapIds) {
            const isCorrect = parsedUserAnswers[gapId] === parsedCorrectAnswers[gapId];

            this.processedQuestions.push({
                id: gapId,
                userAnswer: parsedUserAnswers[gapId],
                correctAnswer: parsedCorrectAnswers[gapId],
                isCorrect: isCorrect,
                context: this.getContextForGap(parsedQuestionText, gapId)
            });
        }
    }

    getContextForGap(text: string, gapId: number): string {
        const marker = `(${gapId})`;
        const index = text.indexOf(marker);
        if (index === -1) return '';

        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + 50);

        let sub = text.substring(start, end);
        if (start > 0) sub = '...' + sub;
        if (end < text.length) sub = sub + '...';

        return sub.replace(marker, '');
    }
}
