import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseResultService } from '../../../../services/exercise-result.service';

@Component({
    selector: 'app-word-formation-review',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './word-formation-review.component.html',
    styleUrls: ['./word-formation-review.component.css']
})
export class WordFormationReviewComponent implements OnInit {
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

        // Extract base words from the text
        const baseWords = this.extractBaseWords(parsedQuestionText);

        for (const gapId of gapIds) {
            const correctAnswer = parsedCorrectAnswers[gapId];
            const userAnswer = parsedUserAnswers[gapId];

            // Check if answer is correct (case-insensitive, supports multiple answers)
            let isCorrect = false;
            if (correctAnswer && correctAnswer.includes('/')) {
                const possibleAnswers = correctAnswer.split('/').map((a: string) => a.trim().toLowerCase());
                isCorrect = possibleAnswers.includes(userAnswer?.toLowerCase());
            } else {
                isCorrect = userAnswer?.toLowerCase() === correctAnswer?.toLowerCase();
            }

            this.processedQuestions.push({
                id: gapId,
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                isCorrect: isCorrect,
                context: this.getContextForGap(parsedQuestionText, gapId),
                baseWord: baseWords[gapId] || ''
            });
        }
    }

    extractBaseWords(text: string): { [key: number]: string } {
        const baseWords: { [key: number]: string } = {};
        const regex = /\((\d+)\)[.…]*\s*\(([A-Z]+)\)/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const gapId = parseInt(match[1]);
            const baseWord = match[2];
            baseWords[gapId] = baseWord;
        }

        return baseWords;
    }

    generateFullText(text: string, correctAnswers: any): string {
        let fullText = text;
        const gapIds = Object.keys(correctAnswers).map(k => parseInt(k)).sort((a, b) => b - a);

        gapIds.forEach(id => {
            const answer = correctAnswers[id];
            // Replace pattern like (1)…………… (ALLOW) with the answer
            const regex = new RegExp(`\\(${id}\\)[.…]*\\s*\\([A-Z]+\\)`, 'g');
            fullText = fullText.replace(regex, `<span class="filled-answer">${answer}</span>`);
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
            .replace(/(\\.{2,}|…+)/g, '')
            .replace(/\s*\([A-Z]+\)\s*/g, '');
    }
}
