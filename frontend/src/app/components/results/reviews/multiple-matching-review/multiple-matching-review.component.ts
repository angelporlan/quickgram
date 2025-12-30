import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseResultService } from '../../../../services/exercise-result.service';

@Component({
  selector: 'app-multiple-matching-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiple-matching-review.component.html',
  styleUrls: ['./multiple-matching-review.component.css']
})
export class MultipleMatchingReviewComponent implements OnInit {
  result: any;
  exercise: any;
  instructions: string = '';
  questions: { id: number, text: string, userAnswer: string, correctAnswer: string, isCorrect: boolean }[] = [];
  passages: { letter: string, title: string, text: string }[] = [];
  showPassages: boolean = false;

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
        const questionId = match[1];
        const questionText = match[2];
        const userAnswer = parsedUserAnswers[questionId];
        const correctAnswer = parsedCorrectAnswers[questionId];

        this.questions.push({
          id: parseInt(questionId),
          text: questionText,
          userAnswer: userAnswer,
          correctAnswer: correctAnswer,
          isCorrect: userAnswer === correctAnswer
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
}
