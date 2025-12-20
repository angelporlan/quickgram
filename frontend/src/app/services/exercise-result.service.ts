import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExerciseResultService {
    private resultSubject = new BehaviorSubject<any>(null);
    private exerciseSubject = new BehaviorSubject<any>(null);

    result$ = this.resultSubject.asObservable();
    exercise$ = this.exerciseSubject.asObservable();

    setResult(exercise: any, result: any, attemptId?: number) {
        if (attemptId && result) {
            result.attemptId = attemptId;
        }
        this.exerciseSubject.next(exercise);
        this.resultSubject.next(result);
    }

    getResult() {
        return this.resultSubject.getValue();
    }

    getExercise() {
        return this.exerciseSubject.getValue();
    }
}
