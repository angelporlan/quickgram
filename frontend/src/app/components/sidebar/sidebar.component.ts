import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    @Input() user: any = {
        username: 'guest',
        name: 'Guest User',
        plan: 'Free'
    };

    constructor(private authService: AuthService, private router: Router) { }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
