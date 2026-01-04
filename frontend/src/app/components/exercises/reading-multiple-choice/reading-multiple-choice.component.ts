import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExerciseService } from '../../../services/exercise.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reading-multiple-choice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reading-multiple-choice.component.html',
  styleUrls: ['./reading-multiple-choice.component.css']
})
export class ReadingMultipleChoiceComponent implements OnInit {
  @Input() exercise: any;
  @Output() close = new EventEmitter<void>();
  @Output() attemptSubmitted = new EventEmitter<any>();

  readingText: string = '';
  questions: any[] = [];
  userAnswers: { [key: string]: string } = {};

  constructor(private exerciseService: ExerciseService) { }

  ngOnInit() {
    if (this.exercise) {
      this.parseExercise();
    }
  }

  parseExercise() {
    const parsedOptions = typeof this.exercise.options === 'string'
      ? JSON.parse(this.exercise.options)
      : this.exercise.options;

    const questionText = this.exercise.question_text;
    const parts = questionText.split(/\n\n(?=\d+\.)/);

    this.readingText = parts[0];

    const questionsPart = parts.slice(1).join('\n\n');
    const questionLines = questionsPart.split('\n').filter((line: string) => line.trim());

    this.questions = [];
    questionLines.forEach((line: string) => {
      const match = line.match(/^(\d+)\.\s+(.+)/);
      if (match) {
        const questionId = match[1];
        const questionText = match[2];
        const options = parsedOptions[questionId] || [];

        this.questions.push({
          id: questionId,
          text: questionText,
          options: options
        });
      }
    });
  }

  get progressPercentage(): number {
    const answered = Object.keys(this.userAnswers).length;
    return this.questions.length > 0 ? (answered / this.questions.length) * 100 : 0;
  }

  get answeredCount(): number {
    return Object.keys(this.userAnswers).length;
  }

  get allQuestionsAnswered(): boolean {
    return Object.keys(this.userAnswers).length === this.questions.length;
  }

  selectAnswer(questionId: string, answer: string) {
    this.userAnswers[questionId] = answer;
  }

  submit() {
    if (!this.allQuestionsAnswered) return;

    const parsedCorrectAnswers = typeof this.exercise.correct_answer === 'string'
      ? JSON.parse(this.exercise.correct_answer)
      : this.exercise.correct_answer;

    let correctCount = 0;
    Object.keys(this.userAnswers).forEach(questionId => {
      if (this.userAnswers[questionId] === parsedCorrectAnswers[questionId]) {
        correctCount++;
      }
    });

    const payload = {
      user_answer: this.userAnswers,
      total_gaps: this.questions.length,
      correct_gaps: correctCount,
      is_fully_correct: correctCount === this.questions.length,
      score: this.questions.length > 0 ? Math.round((correctCount / this.questions.length) * 10) : 0
    };

    this.exerciseService.submitAttempt(this.exercise.id, payload).subscribe({
      next: (res) => {
        this.attemptSubmitted.emit({
          exercise: this.exercise,
          result: payload,
          attemptId: res.attempt.id
        });
      },
      error: (err) => {
        console.error('Submission failed', err);
        alert('Error submitting answer.');
      }
    });
  }
}
