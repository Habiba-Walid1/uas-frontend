import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { CookieService } from './services/cookie.service';   

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    NavbarComponent,
       FooterComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  isLoggedIn = false;
  userRole: string | null = null;

  showCookieBanner = false;   

  constructor(
    private router: Router,
    private cookieService: CookieService   
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadAuthStatus();
      }
    });
  }

  ngOnInit(): void {
    this.loadAuthStatus();
    this.checkCookieConsent();
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

  // COOKIE LOGIC

  checkCookieConsent(): void {
    const consent = this.cookieService.getCookie('cookieConsent');
    this.showCookieBanner = consent !== 'true';
  }

  acceptCookies(): void {
    // Store consent for 365 days
    this.cookieService.setCookie('cookieConsent', 'true', 365);
    this.showCookieBanner = false;
  }

  rejectCookies(): void {
    // Optional: explicitly store rejection or just hide banner
    this.cookieService.setCookie('cookieConsent', 'false', 365);
    this.showCookieBanner = false;
  }
}
