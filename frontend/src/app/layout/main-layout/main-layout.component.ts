import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
    user: any = null;

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getUserInfo().subscribe({
            next: (data) => {
                this.user = data;
            },
            error: (err) => console.error('Error fetching user info', err)
        });
    }
}
