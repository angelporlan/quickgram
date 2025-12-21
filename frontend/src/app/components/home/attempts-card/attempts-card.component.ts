import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-attempts-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './attempts-card.component.html',
    styleUrls: ['./attempts-card.component.css']
})
export class AttemptsCardComponent { }
