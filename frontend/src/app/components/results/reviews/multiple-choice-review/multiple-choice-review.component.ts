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
        this.result = this.resultService.getResult();
        this.exercise = this.resultService.getExercise();

        if (this.exercise && this.result) {
            this.processReview();
        }
    }

    processReview() {
        const parsedQuestionText = this.exercise.question_text;
        const parsedCorrectAnswers = JSON.parse(this.exercise.correct_answer);

        this.processedQuestions = [];
        const gapIds = Object.keys(parsedCorrectAnswers).map(k => parseInt(k)).sort((a, b) => a - b);

        for (const gapId of gapIds) {
            const isCorrect = this.result.user_answer[gapId] === parsedCorrectAnswers[gapId];

            this.processedQuestions.push({
                id: gapId,
                userAnswer: this.result.user_answer[gapId],
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
