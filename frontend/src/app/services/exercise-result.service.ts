import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExerciseResultService {
    private result: any = null;
    private exercise: any = null;

    setResult(exercise: any, result: any, attemptId?: number) {
        this.exercise = exercise;
        this.result = result;
        if (attemptId) {
            this.result.attemptId = attemptId;
        }
    }

    getResult() {
        return this.result;
    }

    getExercise() {
        return this.exercise;
    }
}
