import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-quick-practice-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './quick-practice-card.component.html',
    styleUrl: './quick-practice-card.component.css'
})
export class QuickPracticeCardComponent { }
