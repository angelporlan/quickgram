import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-progress-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './progress-card.component.html',
    styleUrl: './progress-card.component.css'
})
export class ProgressCardComponent implements OnInit {
    accuracy: number = 0;
    completed: number = 0;
    syllabusPercentage: number = 0;
    level: string = 'B1';

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getUserProgress().subscribe({
            next: (data) => {
                this.accuracy = Math.round((data.global.score || 0) * 100);
                this.completed = data.global.attempts || 0;

                if (data.syllabus && data.syllabus.total > 0) {
                    this.syllabusPercentage = Math.round((data.syllabus.completed / data.syllabus.total) * 100);
                } else {
                    this.syllabusPercentage = 0;
                }

                if (this.completed > 150) this.level = 'C1';
                else if (this.completed > 100) this.level = 'B2.2';
                else if (this.completed > 50) this.level = 'B2.1';
                else this.level = 'B1';
            },
            error: (err) => console.error('Error loading progress:', err)
        });
    }
}
