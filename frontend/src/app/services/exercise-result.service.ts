import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExerciseResultService {
    private result: any = null;
    private exercise: any = null;

    setResult(exercise: any, result: any) {
        this.exercise = exercise;
        this.result = result;
    }

    getResult() {
        return this.result;
    }

    getExercise() {
        return this.exercise;
    }
}
