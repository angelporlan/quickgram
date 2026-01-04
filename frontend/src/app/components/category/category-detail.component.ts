import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TopicCardComponent } from './topic-card/topic-card.component';
import { ExerciseService } from '../../services/exercise.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-category-detail',
    standalone: true,
    imports: [CommonModule, TopicCardComponent, RouterLink],
    templateUrl: './category-detail.component.html',
    styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent implements OnInit {
    categoryTitle: string = 'Gramática';
    urlCategory: string = '';
    isLoading: boolean = true;

    // Mock Data matching the image
    // topics = [
    //     {
    //         title: 'Tiempos Verbales',
    //         description: 'Presente Perfecto, Pasado Continuo y sus diferencias clave.',
    //         icon: 'clock',
    //         status: 'in-progress',
    //         progress: 45
    //     },
    //     {
    //         title: 'Condicionales',
    //         description: 'Zero, First, Second y Third Conditional. Estructuras mixtas.',
    //         icon: 'branch', // bifurcación
    //         status: 'not-started', // "Empezar"
    //         progress: 0
    //     },
    //     {
    //         title: 'Voz Pasiva',
    //         description: 'Transformación de activa a pasiva. Uso de "get" y "have".',
    //         icon: 'arrows', // flechas
    //         status: 'not-started',
    //         progress: 0
    //     },
    //     {
    //         title: 'Reported Speech',
    //         description: 'Estilo indirecto en afirmaciones, preguntas y órdenes.',
    //         icon: 'speech',
    //         status: 'not-started',
    //         progress: 0
    //     },
    //     {
    //         title: 'Verbos Modales',
    //         description: 'Obligación, permiso, probabilidad y deducción.',
    //         icon: 'brain', // mental
    //         status: 'not-started',
    //         progress: 0
    //     },
    //     {
    //         title: 'Phrasal Verbs Avanzados',
    //         description: 'Completa el módulo de vocabulario para desbloquear.',
    //         icon: 'locked',
    //         status: 'locked',
    //         progress: 0
    //     }
    // ];
    topics: any[] = [];

    constructor(private route: ActivatedRoute, private exerciseService: ExerciseService, private router: Router) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const slug = params.get('slug');
            this.urlCategory = slug || '';
            this.updateCategoryContent(slug);
            this.getTopics();
        });
    }

    updateCategoryContent(slug: string | null) {
        if (slug === 'vocabulary') {
            this.categoryTitle = 'Vocabulary';
        } else if (slug === 'reading') {
            this.categoryTitle = 'Reading';
        } else if (slug === 'listening') {
            this.categoryTitle = 'Listening';
        } else if (slug === 'writing') {
            this.categoryTitle = 'Writing';
        } else if (slug === 'use-of-english') {
            this.categoryTitle = 'Use of English';
        } else {
            this.categoryTitle = 'Grammar';
        }
    }

    getTopics() {
        this.isLoading = true;
        this.topics = [];
        this.exerciseService.getSubcategories(this.categoryTitle)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe((topics: any[]) => {
                this.topics = topics.map(topic => {
                    const isLocked = topic.name === 'Short Dialogues' || topic.name === 'Long Audios';
                    const progress = topic.totalItems > 0 ? (topic.totalCompleted / topic.totalItems) * 100 : 0;

                    let status = 'not-started';
                    if (isLocked) {
                        status = 'locked';
                    } else if (progress >= 100) {
                        status = 'completed';
                    } else if (progress > 0) {
                        status = 'in-progress';
                    }

                    return {
                        ...topic,
                        title: topic.name,
                        icon: isLocked ? 'locked' : this.getIconForTopic(topic.name),
                        status: status,
                        progress: progress,
                        totalCompleted: topic.totalCompleted,
                        totalItems: topic.totalItems
                    };
                });
            });
    }

    private getIconForTopic(name: string): string {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('time') || lowerName.includes('tiempo') || lowerName.includes('verb')) return 'clock';
        if (lowerName.includes('condition') || lowerName.includes('condicion')) return 'branch';
        if (lowerName.includes('passive') || lowerName.includes('pasiva') || lowerName.includes('voice')) return 'arrows';
        if (lowerName.includes('speech') || lowerName.includes('report') || lowerName.includes('indirect')) return 'speech';
        if (lowerName.includes('modal') || lowerName.includes('think') || lowerName.includes('idea')) return 'brain';

        const icons = ['clock', 'branch', 'arrows', 'speech', 'brain'];
        return icons[Math.floor(Math.random() * icons.length)];
    }

    handleStartTopic(topic: any) {
        this.router.navigate(['/exercise', topic.title]);
    }

    handleListTopic(topic: any) {
        this.router.navigate(['/exercises/list', topic.title]);
    }
}
