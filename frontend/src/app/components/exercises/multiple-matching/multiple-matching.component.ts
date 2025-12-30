import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExerciseService } from '../../../services/exercise.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multiple-matching',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multiple-matching.component.html',
  styleUrls: ['./multiple-matching.component.css']
})
export class MultipleMatchingComponent implements OnInit {
  @Input() exercise: any;
  @Output() close = new EventEmitter<void>();
  @Output() attemptSubmitted = new EventEmitter<any>();

  instructions: string = '';
  questions: { id: number, text: string }[] = [];
  passages: { letter: string, title: string, text: string }[] = [];
  availableOptions: string[] = [];
  userAnswers: { [key: number]: string } = {};

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

    this.availableOptions = parsedOptions.options || [];

    const questionText = this.exercise.question_text;
    const parts = questionText.split('***');

    const questionsSection = parts[0];
    const passagesSection = parts[1];

    // Parse instructions and questions
    const questionLines = questionsSection.split('\n').filter((line: string) => line.trim());
    this.instructions = questionLines[0];

    this.questions = [];
    questionLines.slice(1).forEach((line: string) => {
      const match = line.match(/^(\d+)\s+(.+?)\s+\(\d+\)/);
      if (match) {
        this.questions.push({
          id: parseInt(match[1]),
          text: match[2]
        });
      }
    });

    // Parse passages
    this.passages = [];
    const passageParts = passagesSection.trim().split(/\n\n(?=\*\*[A-Z])/);

    passageParts.forEach((part: string) => {
      const titleMatch = part.match(/\*\*([A-Z])\s+(.+?)\*\*/);
      if (titleMatch) {
        const letter = titleMatch[1];
        const title = titleMatch[2];
        const text = part.substring(part.indexOf('**', 2) + 2).trim();

        this.passages.push({
          letter: letter,
          title: title,
          text: text
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

  selectAnswer(questionId: number, answer: string) {
    this.userAnswers[questionId] = answer;
  }

  submit() {
    if (!this.allQuestionsAnswered) return;

    const parsedCorrectAnswers = typeof this.exercise.correct_answer === 'string'
      ? JSON.parse(this.exercise.correct_answer)
      : this.exercise.correct_answer;

    let correctCount = 0;
    Object.keys(this.userAnswers).forEach(questionId => {
      if (this.userAnswers[parseInt(questionId)] === parsedCorrectAnswers[questionId]) {
        correctCount++;
      }
    });

    const payload = {
      user_answer: this.userAnswers,
      total_gaps: this.questions.length,
      correct_gaps: correctCount,
      is_fully_correct: correctCount === this.questions.length,
      score: correctCount
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
        alert('Error al enviar la respuesta.');
      }
    });
  }
}
