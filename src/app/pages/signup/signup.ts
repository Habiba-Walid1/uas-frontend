import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {

  constructor(private router: Router) {}

  errorMessage = "";

  formData = {
    username: '',
    name: '',
    email: '',
    password: '',
    role: '',
    preferences: '',
    picture: '',
    creditCard: {
      number: '',
      expiry: '',
      cvv: '',
      holder: ''
    }
  };

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.formData.picture = reader.result as string;
    reader.readAsDataURL(file);
  }

  onSignup() {
    if (!this.formData.username ||
        !this.formData.email ||
        !this.formData.password ||
        !this.formData.role ||
        !this.formData.creditCard.number ||
        !this.formData.creditCard.expiry ||
        !this.formData.creditCard.cvv ||
        !this.formData.creditCard.holder) 
    {
      this.errorMessage = "Please fill all required fields.";
      return;
    }

    localStorage.setItem("user", JSON.stringify(this.formData));

    alert("Signup successful! Please login.");
    this.router.navigate(['/login']);
  }
}
