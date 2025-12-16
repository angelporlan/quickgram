import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-topic-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './topic-card.component.html',
    styleUrl: './topic-card.component.css'
})
export class TopicCardComponent {
    @Input() topic: any;
}
