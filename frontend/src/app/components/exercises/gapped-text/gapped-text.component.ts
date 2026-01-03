import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExerciseService } from '../../../services/exercise.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gapped-text',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gapped-text.component.html',
  styleUrls: ['./gapped-text.component.css']
})
export class GappedTextComponent implements OnInit {
  @Input() exercise: any;
  @Output() close = new EventEmitter<void>();
  @Output() attemptSubmitted = new EventEmitter<any>();

  instructions: string = '';
  readingText: string = '';
  availableSentences: { [key: string]: string } = {};
  gaps: number[] = [];
  userAnswers: { [key: number]: string } = {};
  selectedSentence: string | null = null;

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

    this.availableSentences = parsedOptions.sentences || {};

    const questionText = this.exercise.question_text;
    const parts = questionText.split('\n\n');

    this.instructions = parts[0];
    this.readingText = parts.slice(1).join('\n\n');

    // Extract gap numbers from the text
    const gapMatches = this.readingText.matchAll(/\((\d+)\)/g);
    this.gaps = Array.from(gapMatches, match => parseInt(match[1]));
  }

  get progressPercentage(): number {
    const answered = Object.keys(this.userAnswers).length;
    return this.gaps.length > 0 ? (answered / this.gaps.length) * 100 : 0;
  }

  get answeredCount(): number {
    return Object.keys(this.userAnswers).length;
  }

  get allGapsFilled(): boolean {
    return Object.keys(this.userAnswers).length === this.gaps.length;
  }

  selectSentence(gapNumber: number, sentenceKey: string) {
    this.userAnswers[gapNumber] = sentenceKey;
  }

  isSentenceUsed(sentenceKey: string): boolean {
    return Object.values(this.userAnswers).includes(sentenceKey);
  }

  getTextWithGaps(): string[] {
    const parts: string[] = [];
    let lastIndex = 0;
    const regex = /\((\d+)\)…+/g;
    let match;

    while ((match = regex.exec(this.readingText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(this.readingText.substring(lastIndex, match.index));
      }

      const gapNumber = parseInt(match[1]);
      parts.push(`GAP_${gapNumber}`);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < this.readingText.length) {
      parts.push(this.readingText.substring(lastIndex));
    }

    return parts;
  }

  submit() {
    if (!this.allGapsFilled) return;

    const parsedCorrectAnswers = typeof this.exercise.correct_answer === 'string'
      ? JSON.parse(this.exercise.correct_answer)
      : this.exercise.correct_answer;

    let correctCount = 0;
    Object.keys(this.userAnswers).forEach(gapNumber => {
      if (this.userAnswers[parseInt(gapNumber)] === parsedCorrectAnswers[gapNumber]) {
        correctCount++;
      }
    });

    const payload = {
      user_answer: this.userAnswers,
      total_gaps: this.gaps.length,
      correct_gaps: correctCount,
      is_fully_correct: correctCount === this.gaps.length,
      score: this.gaps.length > 0 ? Math.round((correctCount / this.gaps.length) * 10) : 0
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
