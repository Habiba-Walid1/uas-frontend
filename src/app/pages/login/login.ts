import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  constructor(private router: Router) {}

  errorMessage = '';

  form = {
    username: '',
    password: ''
  };

  onLogin() {

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      this.errorMessage = "No user found. Please signup first.";
      return;
    }

    const userData = JSON.parse(storedUser);

    if (this.form.username === userData.username &&
        this.form.password === userData.password) 
    {
      sessionStorage.setItem("activeUser", JSON.stringify({
        username: userData.username,
        role: userData.role,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        creditCard: userData.creditCard,
        preferences: userData.preferences
      }));

      this.router.navigate(['/profile']);

    } else {
      this.errorMessage = "Incorrect username or password.";
    }
  }
}
