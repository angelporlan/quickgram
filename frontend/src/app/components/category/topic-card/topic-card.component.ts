import { Component, Input, Output, EventEmitter } from '@angular/core';
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
    @Output() startTopic = new EventEmitter<any>();

    onStart() {
        if (this.topic.status !== 'locked') {
            this.startTopic.emit(this.topic);
        }
    }
}
