import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  adminu = 'admin';
  adminp = '1';

  username = '';
  password = '';
  selectedRole: 'student' | 'staff' | 'admin' = 'student';

  errorMsg = '';
  rememberMe = false;   // ✅ NEW: bound to the checkbox in the template

  constructor(private router: Router) {}

  ngOnInit(): void {
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    // 👉 Check if admin already exists
    const hasAdmin = users.some((u: any) => u.username === 'admin');

    if (!hasAdmin) {
      const adminUser = {
        fullname: 'System Administrator',
        username: 'admin',
        email: 'admin@unipay.com',
        password: '1',     // You can change the password
        role: 'admin',
        staffId: 'ADM-001',
        universityId: null,
        profileImage: null
      };

      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));

      console.log('✅ Hardcoded admin created');
    }
  }

  login() {
    this.errorMsg = '';

    // Basic validation
    if (!this.username || !this.password) {
      this.errorMsg = 'Please fill all fields.';
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Try to find match
    const foundUser = existingUsers.find((u: any) =>
      u.username === this.username && u.password === this.password
    );

    if (!foundUser) {
      this.errorMsg = 'Incorrect email or password.';
      return;
    }

    // ✅ SESSION STORAGE: active logged-in session (required by M1)
    sessionStorage.setItem('activeUser', JSON.stringify(foundUser));

    // ✅ LOCAL STORAGE: long-lived data (rememberMe + profile snapshot)
    localStorage.setItem('rememberMe', JSON.stringify(this.rememberMe));
    if (this.rememberMe) {
      localStorage.setItem('profileSnapshot', JSON.stringify(foundUser));
    } else {
      localStorage.removeItem('profileSnapshot');
    }

    // ✅ Redirect based on role
    const role = foundUser.role;
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'staff') {
      this.router.navigate(['/staff']);
    } else {
      this.router.navigate(['/student']);
    }
  }
}
