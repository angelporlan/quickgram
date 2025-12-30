import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseResultService } from '../../../../services/exercise-result.service';

@Component({
  selector: 'app-essay-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './essay-review.component.html',
  styleUrls: ['./essay-review.component.css']
})
export class EssayReviewComponent implements OnInit {
  result: any;
  exercise: any;
  userEssay: string = '';
  modelAnswer: string = '';
  wordCount: number = 0;

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
    let parsedUserAnswer = this.result.user_answer;
    let parsedCorrectAnswer = this.exercise.correct_answer;

    if (typeof parsedUserAnswer === 'string') {
      try {
        parsedUserAnswer = JSON.parse(parsedUserAnswer);
      } catch (e) {
        console.error("Error parsing user_answer", e);
        parsedUserAnswer = {};
      }
    }

    if (typeof parsedCorrectAnswer === 'string') {
      try {
        parsedCorrectAnswer = JSON.parse(parsedCorrectAnswer);
      } catch (e) {
        console.error("Error parsing correct_answer", e);
        parsedCorrectAnswer = {};
      }
    }

    this.userEssay = parsedUserAnswer?.essay || '';
    this.modelAnswer = parsedCorrectAnswer?.model_answer || '';
    this.wordCount = this.result.word_count || this.countWords(this.userEssay);
  }

  countWords(text: string): number {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  }
}
