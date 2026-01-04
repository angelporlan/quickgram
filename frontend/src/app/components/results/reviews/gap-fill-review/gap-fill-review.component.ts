import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseResultService } from '../../../../services/exercise-result.service';

@Component({
    selector: 'app-gap-fill-review',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './gap-fill-review.component.html',
    styleUrls: ['./gap-fill-review.component.css']
})
export class GapFillReviewComponent implements OnInit {
    result: any;
    exercise: any;
    processedQuestions: any[] = [];
    fullTextWithSolutions: string = '';
    showFullText: boolean = false;

    constructor(private resultService: ExerciseResultService) { }

    ngOnInit() {
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

        this.fullTextWithSolutions = this.generateFullText(parsedQuestionText, parsedCorrectAnswers);

        for (const gapId of gapIds) {
            const correctAnswerStr = parsedCorrectAnswers[gapId];
            const userAnswer = parsedUserAnswers[gapId];

            const correctOptions = correctAnswerStr.split('/').map((opt: string) => opt.trim());
            const userAnswerLower = userAnswer?.toLowerCase() || '';
            const isCorrect = correctOptions.some((opt: string) => opt.toLowerCase() === userAnswerLower);

            let otherAnswers: string[] = [];
            if (isCorrect && correctOptions.length > 1) {
                otherAnswers = correctOptions.filter((opt: string) => opt.toLowerCase() !== userAnswerLower);
            }

            this.processedQuestions.push({
                id: gapId,
                userAnswer: userAnswer,
                correctAnswer: correctAnswerStr,
                isCorrect: isCorrect,
                context: this.getContextForGap(parsedQuestionText, gapId),
                otherAnswers: otherAnswers
            });
        }
    }

    generateFullText(text: string, correctAnswers: any): string {
        let fullText = text;
        const gapIds = Object.keys(correctAnswers).map(k => parseInt(k)).sort((a, b) => b - a);

        gapIds.forEach(id => {
            const answer = correctAnswers[id];
            const displayAnswer = answer.split('/')[0].trim();
            const regex = new RegExp(`[._]*\\s*\\(${id}\\)\\s*[._]*`, 'g');

            fullText = fullText.replace(regex, `<span class="filled-answer">${displayAnswer}</span>`);
        });

        return fullText;
    }

    toggleFullText() {
        this.showFullText = !this.showFullText;
    }

    getContextForGap(text: string, gapId: number): string {
        const marker = `(${gapId})`;
        const markerIndex = text.indexOf(marker);
        if (markerIndex === -1) return '';

        let start = 0;
        for (let i = markerIndex - 1; i >= 0; i--) {
            if (['.', '!', '?', '\n'].includes(text[i])) {
                start = i + 1;
                break;
            }
        }

        let end = text.length;
        for (let i = markerIndex; i < text.length; i++) {
            if (['.', '!', '?', '\n'].includes(text[i])) {
                end = i + 1;
                break;
            }
        }

        return text.substring(start, end).trim();
    }

    removePointsFills(text: string): string {
        return text.replace(/\s*\(\d+\)\s*/g, '')
            .replace(/(\\.{2,}|…+)/g, '');
    }
}
