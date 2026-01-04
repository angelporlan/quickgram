import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseResultService } from '../../../../services/exercise-result.service';

@Component({
    selector: 'app-key-word-transformation-review',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './key-word-transformation-review.component.html',
    styleUrls: ['./key-word-transformation-review.component.css']
})
export class KeyWordTransformationReviewComponent implements OnInit {
    result: any;
    exercise: any;
    processedQuestions: any[] = [];

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

        const questions = this.parseQuestions(parsedQuestionText);

        this.processedQuestions = [];
        const questionIds = Object.keys(parsedCorrectAnswers).map(k => parseInt(k)).sort((a, b) => a - b);

        for (const questionId of questionIds) {
            const correctAnswer = parsedCorrectAnswers[questionId];
            const userAnswer = parsedUserAnswers[questionId];
            const questionData = questions.find(q => q.id === questionId);

            let isCorrect = false;
            let otherAnswers: string[] = [];

            if (correctAnswer && correctAnswer.includes('/')) {
                const possibleAnswers = correctAnswer.split('/').map((a: string) => a.trim());
                isCorrect = possibleAnswers.some((p: string) => p.toLowerCase() === userAnswer?.trim().toLowerCase());

                if (isCorrect) {
                    otherAnswers = possibleAnswers.filter((p: string) => p.toLowerCase() !== userAnswer?.trim().toLowerCase());
                }
            } else {
                isCorrect = userAnswer?.toLowerCase() === correctAnswer?.toLowerCase();
            }

            this.processedQuestions.push({
                id: questionId,
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                isCorrect: isCorrect,
                firstSentence: questionData?.firstSentence || '',
                keyword: questionData?.keyword || '',
                secondSentence: questionData?.secondSentence || '',
                otherAnswers: otherAnswers
            });
        }
    }

    parseQuestions(text: string): any[] {
        const questionBlocks = text.split(/\n\n(?=\d+\.)/);
        const questions: any[] = [];

        for (const block of questionBlocks) {
            if (!block.trim() || block.includes('Key Word Transformation')) continue;

            const numberMatch = block.match(/^(\d+)\./);
            if (!numberMatch) continue;

            const questionId = parseInt(numberMatch[1]);
            const keywordMatch = block.match(/\*\*([A-Z]+)\*\*/);
            const keyword = keywordMatch ? keywordMatch[1] : '';

            const lines = block.split('\n').filter(l => l.trim());
            const firstSentence = lines[0].replace(/^\d+\.\s*/, '').trim();

            let secondSentence = '';
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].includes('(') && lines[i].includes(')…')) {
                    secondSentence = lines[i].trim();
                    break;
                }
            }

            questions.push({
                id: questionId,
                firstSentence: firstSentence,
                keyword: keyword,
                secondSentence: secondSentence
            });
        }

        return questions;
    }

    getCompleteSentence(sentence: string, answer: string): string {
        return sentence.replace(/\(\d+\)…+/, `<span class="filled-answer">${answer}</span>`);
    }
}
