import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ExerciseResultService } from '../../../services/exercise-result.service';

@Component({
    selector: 'app-exercise-results',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './exercise-results.component.html',
    styleUrls: ['./exercise-results.component.css']
})
export class ExerciseResultsComponent implements OnInit {
    result: any;
    exercise: any;

    constructor(
        private resultService: ExerciseResultService,
        private router: Router,
        private location: Location
    ) { }

    ngOnInit() {
        this.result = this.resultService.getResult();
        this.exercise = this.resultService.getExercise();

        if (!this.result) {
            this.location.back();
        }
    }

    get scorePercentage(): number {
        if (!this.result || !this.result.total_gaps) return 0;
        return Math.round((this.result.score / this.result.total_gaps) * 100);
    }
}
