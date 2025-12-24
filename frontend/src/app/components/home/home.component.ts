import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressCardComponent } from './progress-card/progress-card.component';
import { AiTutorCardComponent } from './ai-tutor-card/ai-tutor-card.component';
import { QuickPracticeCardComponent } from './quick-practice-card/quick-practice-card.component';
import { AttemptsCardComponent } from './attempts-card/attempts-card.component';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        ProgressCardComponent,
        AiTutorCardComponent,
        QuickPracticeCardComponent,
        AttemptsCardComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    user: any = null;

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getUserInfo().subscribe({
            next: (data) => {
                this.user = data;
            },
            error: (err) => console.error('Error fetching user info', err)
        });
    }
}
