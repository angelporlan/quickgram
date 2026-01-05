import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExerciseService } from '../../../services/exercise.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-essay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './essay.component.html',
  styleUrls: ['./essay.component.css']
})
export class EssayComponent implements OnInit {
  @Input() exercise: any;
  @Output() close = new EventEmitter<void>();
  @Output() attemptSubmitted = new EventEmitter<any>();

  userEssay: string = '';
  minWords: number = 140;
  maxWords: number = 190;

  constructor(
    private exerciseService: ExerciseService
  ) { }

  ngOnInit() {
    const wordCountMatch = this.exercise?.question_text?.match(/(\d+)-(\d+)\s+words/i);
    if (wordCountMatch) {
      this.minWords = parseInt(wordCountMatch[1]);
      this.maxWords = parseInt(wordCountMatch[2]);
    }
  }

  get wordCount(): number {
    if (!this.userEssay.trim()) return 0;
    return this.userEssay.trim().split(/\s+/).length;
  }

  get progressPercentage(): number {
    if (this.wordCount >= this.maxWords) return 100;
    return Math.min((this.wordCount / this.minWords) * 100, 100);
  }

  get canSubmit(): boolean {
    return this.wordCount >= this.minWords && this.wordCount <= this.maxWords;
  }

  get wordCountStatus(): string {
    if (this.wordCount < this.minWords) {
      return `${this.wordCount} / ${this.minWords} words (minimum)`;
    } else if (this.wordCount > this.maxWords) {
      return `${this.wordCount} / ${this.maxWords} words (exceeded!)`;
    } else {
      return `${this.wordCount} words (${this.minWords}-${this.maxWords})`;
    }
  }

  submit() {
    if (!this.canSubmit) return;

    const payload = {
      user_answer: { essay: this.userEssay },
      word_count: this.wordCount,
      total_gaps: 1,
      correct_gaps: 1,
      is_fully_correct: true,
      score: 10
    };

    console.log('Submitting essay:', payload);

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
