import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  
  step = 1;
  selectedRole: 'student' | 'staff' | null = null;

  fullname = '';
  username = '';
  email = '';
  universityId = '';
  staffId = '';
  password = '';
  confirmPassword = '';
  profileImage: string | null = null;


  constructor(private router: Router) {}

  chooseRole(role: 'student' | 'staff') {
    this.selectedRole = role;
    this.step = 2;
  }

uploadImage(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    this.profileImage = reader.result as string;
  };
  reader.readAsDataURL(file);
}

submit() {
  if (!this.fullname || !this.email || !this.username || !this.password) {
    alert("Please fill all fields");
    return;
  }

  if (this.password !== this.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const allUsers = JSON.parse(localStorage.getItem('users') || '[]');

  if (allUsers.some((u: any) => u.email === this.email)) {
    alert("Email already registered");
    return;
  }

  const newUser = {
    fullname: this.fullname,
    username: this.username,
    email: this.email,
    password: this.password,
    role: this.selectedRole,
    universityId: this.universityId || null,
    staffId: this.staffId || null,
    profileImage: this.profileImage || null
  };

  allUsers.push(newUser);
  localStorage.setItem('users', JSON.stringify(allUsers));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  localStorage.setItem('role', this.selectedRole || 'guest');

  this.router.navigate(['/profile']);
}

}
