import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseResultService } from '../../../../services/exercise-result.service';

@Component({
  selector: 'app-reading-multiple-choice-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reading-multiple-choice-review.component.html',
  styleUrls: ['./reading-multiple-choice-review.component.css']
})
export class ReadingMultipleChoiceReviewComponent implements OnInit {
  result: any;
  exercise: any;
  readingText: string = '';
  questions: any[] = [];
  showReadingText: boolean = false;

  toggleReadingText() {
    this.showReadingText = !this.showReadingText;
  }

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
        const userAnswer = parsedUserAnswers[questionId];
        const correctAnswer = parsedCorrectAnswers[questionId];
        const isCorrect = userAnswer === correctAnswer;

        this.questions.push({
          id: questionId,
          text: questionText,
          options: options,
          userAnswer: userAnswer,
          correctAnswer: correctAnswer,
          isCorrect: isCorrect
        });
      }
    });
  }
}
