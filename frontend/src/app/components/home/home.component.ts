import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressCardComponent } from './progress-card/progress-card.component';
import { AiTutorCardComponent } from './ai-tutor-card/ai-tutor-card.component';
import { QuickPracticeCardComponent } from './quick-practice-card/quick-practice-card.component';
import { AttemptsCardComponent } from './attempts-card/attempts-card.component';

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
export class HomeComponent {
    // User data is now managed in MainLayout, but keeping this for the greeting in the header
    user = {
        name: 'Alex Morgan',
        username: 'alexm',
        plan: 'Premium'
    };
}
