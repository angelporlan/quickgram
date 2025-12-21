import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CategoryDetailComponent } from './components/category/category-detail.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'attempts', loadComponent: () => import('./components/attempts/attempts.component').then(m => m.AttemptsComponent) },
            { path: 'user', loadComponent: () => import('./components/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
            { path: 'roles', loadComponent: () => import('./components/roles/roles.component').then(m => m.RolesComponent) },
            { path: 'category/:slug', component: CategoryDetailComponent }
        ]
    },
    {
        path: 'exercise/:subcategory',
        loadComponent: () => import('./components/exercises/exercise-page/exercise-page.component').then(m => m.ExercisePageComponent)
    },
    {
        path: 'results/:attemptId',
        loadComponent: () => import('./components/results/exercise-results/exercise-results.component').then(m => m.ExerciseResultsComponent),
        children: [
            {
                path: 'multiple-choice',
                loadComponent: () => import('./components/results/reviews/multiple-choice-review/multiple-choice-review.component').then(m => m.MultipleChoiceReviewComponent)
            }
        ]
    },
    {
        path: 'results',
        loadComponent: () => import('./components/results/exercise-results/exercise-results.component').then(m => m.ExerciseResultsComponent),
        children: [
            {
                path: 'multiple-choice',
                loadComponent: () => import('./components/results/reviews/multiple-choice-review/multiple-choice-review.component').then(m => m.MultipleChoiceReviewComponent)
            }
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: '' }
];
