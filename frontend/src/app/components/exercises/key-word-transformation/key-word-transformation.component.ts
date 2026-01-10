import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { safeParseJSON } from '../../../utils/json.utils';
import { ExerciseService } from '../../../services/exercise.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-key-word-transformation',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './key-word-transformation.component.html',
    styleUrls: ['./key-word-transformation.component.css']
})
export class KeyWordTransformationComponent implements OnInit {
    @Input() exercise: any;
    @Output() close = new EventEmitter<void>();
    @Output() attemptSubmitted = new EventEmitter<any>();

    parsedAnswers: any = {};
    questions: any[] = [];

    currentQuestionIndex: number = 0;
    userAnswers = new Map<number, string>();
    totalQuestions = 0;
    answeredQuestions = 0;

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
            this.parsedAnswers = safeParseJSON(this.exercise.correct_answer);
            this.processText(this.exercise.question_text);
            this.totalQuestions = this.questions.length;
        } catch (e) {
            console.error('Error parsing exercise data', e);
        }
    }

    processText(text: string) {
        const questionBlocks = text.split(/\n\n(?=\d+\.)/);

        this.questions = [];

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

            this.questions.push({
                id: questionId,
                firstSentence: firstSentence,
                keyword: keyword,
                secondSentence: secondSentence
            });
        }
    }

    get currentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    get currentAnswer(): string {
        if (!this.currentQuestion) return '';
        return this.userAnswers.get(this.currentQuestion.id) || '';
    }

    onInputChange(value: string) {
        if (!this.currentQuestion) return;

        if (value.trim()) {
            this.userAnswers.set(this.currentQuestion.id, value.trim());
        } else {
            this.userAnswers.delete(this.currentQuestion.id);
        }
        this.answeredQuestions = this.userAnswers.size;
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        }
    }

    goToQuestion(index: number) {
        this.currentQuestionIndex = index;
    }

    get progressPercentage(): number {
        return this.totalQuestions > 0 ? (this.answeredQuestions / this.totalQuestions) * 100 : 0;
    }

    get allQuestionsAnswered(): boolean {
        return this.answeredQuestions === this.totalQuestions && this.totalQuestions > 0;
    }

    wordCount(text: string): number {
        return text.trim().split(/\s+/).filter(w => w.length > 0).length;
    }

    get currentWordCount(): number {
        return this.wordCount(this.currentAnswer);
    }

    get isValidWordCount(): boolean {
        const count = this.currentWordCount;
        return count >= 2 && count <= 5;
    }

    submit() {
        if (!this.allQuestionsAnswered) return;

        let correctCount = 0;
        const userAnswerObj: any = {};

        this.userAnswers.forEach((answer, questionId) => {
            userAnswerObj[questionId] = answer;
            const correctAnswer = this.parsedAnswers[questionId];

            if (correctAnswer) {
                const possibleAnswers = correctAnswer.split('/').map((a: string) => a.trim().toLowerCase());
                if (possibleAnswers.includes(answer.toLowerCase())) {
                    correctCount++;
                }
            }
        });

        const payload = {
            user_answer: userAnswerObj,
            total_gaps: this.totalQuestions,
            correct_gaps: correctCount,
            is_fully_correct: correctCount === this.totalQuestions,
            score: this.totalQuestions > 0 ? Math.round((correctCount / this.totalQuestions) * 10) : 0
        };

        console.log('Submitting attempt:', payload);

        this.exerciseService.submitAttempt(this.exercise.id, payload).subscribe({
            next: (res) => {
                console.log('Submission successful', res);
                const attemptId = res.attempt.id;

                this.attemptSubmitted.emit({
                    exercise: this.exercise,
                    result: payload,
                    attemptId: attemptId
                });
            },
            error: (err) => {
                console.error('Submission failed', err);
                alert('Error submitting answer.');
            }
        });
    }
}
