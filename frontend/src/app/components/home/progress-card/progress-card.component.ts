import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-progress-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './progress-card.component.html',
    styleUrl: './progress-card.component.css'
})
export class ProgressCardComponent { }
