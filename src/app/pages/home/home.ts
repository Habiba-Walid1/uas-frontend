import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  isLoggedIn = false;
  user: any = null;

  constructor() {
    const session = sessionStorage.getItem('activeUser');

    if (session) {
      this.isLoggedIn = true;
      this.user = JSON.parse(session);
    }
  }
}

