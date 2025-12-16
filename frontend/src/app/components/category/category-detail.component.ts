import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TopicCardComponent } from './topic-card/topic-card.component';
import { ExerciseService } from '../../services/exercise.service';

@Component({
    selector: 'app-category-detail',
    standalone: true,
    imports: [CommonModule, TopicCardComponent],
    templateUrl: './category-detail.component.html',
    styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent implements OnInit {
    categoryTitle: string = 'Gramática';
    urlCategory: string = '';

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

    constructor(private route: ActivatedRoute, private exerciseService: ExerciseService) { }

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
        this.exerciseService.getSubcategories(this.categoryTitle).subscribe((topics: any[]) => {
            this.topics = topics;
        });
    }
}
