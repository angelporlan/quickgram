import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseResultService } from '../../../../services/exercise-result.service';

@Component({
  selector: 'app-gapped-text-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gapped-text-review.component.html',
  styleUrls: ['./gapped-text-review.component.css']
})
export class GappedTextReviewComponent implements OnInit {
  result: any;
  exercise: any;
  instructions: string = '';
  readingText: string = '';
  availableSentences: { [key: string]: string } = {};
  gaps: { number: number, userAnswer: string, correctAnswer: string, isCorrect: boolean }[] = [];
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
    let parsedUserAnswers = this.result.user_answer;
    let parsedCorrectAnswers = this.exercise.correct_answer;
    let parsedOptions = this.exercise.options;

    if (typeof parsedUserAnswers === 'string') {
      try {
        parsedUserAnswers = JSON.parse(parsedUserAnswers);
      } catch (e) {
        console.error("Error parsing user_answer", e);
        parsedUserAnswers = {};
      }
    }

    if (typeof parsedCorrectAnswers === 'string') {
      try {
        parsedCorrectAnswers = JSON.parse(parsedCorrectAnswers);
      } catch (e) {
        console.error("Error parsing correct_answer", e);
        parsedCorrectAnswers = {};
      }
    }

    if (typeof parsedOptions === 'string') {
      try {
        parsedOptions = JSON.parse(parsedOptions);
      } catch (e) {
        console.error("Error parsing options", e);
        parsedOptions = {};
      }
    }

    this.availableSentences = parsedOptions.sentences || {};

    const questionText = this.exercise.question_text;
    const parts = questionText.split('\n\n');

    this.instructions = parts[0];
    this.readingText = parts.slice(1).join('\n\n');

    this.gaps = [];
    Object.keys(parsedCorrectAnswers).forEach(gapNumber => {
      const userAnswer = parsedUserAnswers[gapNumber];
      const correctAnswer = parsedCorrectAnswers[gapNumber];

      this.gaps.push({
        number: parseInt(gapNumber),
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: userAnswer === correctAnswer
      });
    });

    this.gaps.sort((a, b) => a.number - b.number);
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
      const gap = this.gaps.find(g => g.number === gapNumber);

      if (gap) {
        parts.push(`GAP_${gapNumber}_${gap.isCorrect ? 'CORRECT' : 'INCORRECT'}_${gap.userAnswer}`);
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < this.readingText.length) {
      parts.push(this.readingText.substring(lastIndex));
    }

    return parts;
  }
}
