import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  isLoggedIn = false;
  userRole: string | null = null;

  constructor(private router: Router) {
    this.loadAuthStatus();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadAuthStatus();
      }
    });
  }

  loadAuthStatus() {
    const session = sessionStorage.getItem('activeUser');

    if (session) {
      const user = JSON.parse(session);
      this.isLoggedIn = true;
      this.userRole = user.role;
    } else {
      this.isLoggedIn = false;
      this.userRole = null;
    }
  }

  logout() {
    sessionStorage.removeItem('activeUser');
    this.isLoggedIn = false;
    this.userRole = null;
    this.router.navigate(['/login']);
  }
}
