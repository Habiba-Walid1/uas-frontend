import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from '../../services/cookie.service';

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
  rememberMe = false; // if you don't have the checkbox, this will just stay false

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    // 👉 Check if admin already exists
    const hasAdmin = users.some((u: any) => u.username === 'admin');

    if (!hasAdmin) {
      const adminUser = {
        fullname: 'System Administrator',
        username: 'admin',
        email: 'admin@unipay.com',
        password: '1', // You can change this later
        role: 'admin',
        staffId: 'ADM-001',
        universityId: null,
        profileImage: null
      };

      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));

      console.log('✅ Hardcoded admin created');
    }

    // ✅ NEW: Prefill username + role from cookies if they exist
    const savedUsername = this.cookieService.getCookie('lastUsername');
    const savedRole = this.cookieService.getCookie('lastRole');

    if (savedUsername) {
      this.username = savedUsername;
    }

    if (savedRole && ['student', 'staff', 'admin'].includes(savedRole)) {
      this.selectedRole = savedRole as 'student' | 'staff' | 'admin';
    }
  }

  login() {
    this.errorMsg = '';

    if (!this.username || !this.password) {
      this.errorMsg = 'Please fill all fields.';
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

    const foundUser = existingUsers.find(
      (u: any) => u.username === this.username && u.password === this.password
    );

    if (!foundUser) {
      this.errorMsg = 'Incorrect email or password.';
      return;
    }

    // ✅ Session storage: active logged-in user (for assignment requirement)
    sessionStorage.setItem('activeUser', JSON.stringify(foundUser));

    // ✅ Local storage: keep old behaviour so guard & other code still work
    localStorage.setItem('role', foundUser.role);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));

    // Optional: remember-me behaviour
    localStorage.setItem('rememberMe', JSON.stringify(this.rememberMe));
    if (this.rememberMe) {
      localStorage.setItem('profileSnapshot', JSON.stringify(foundUser));
    } else {
      localStorage.removeItem('profileSnapshot');
    }

    // ✅ NEW: store safe user-related info in cookies
    this.cookieService.setCookie('lastUsername', foundUser.username, 7);
    this.cookieService.setCookie('lastRole', foundUser.role, 7);

    // ✅ Redirect exactly like before
    this.router.navigate(['/profile']);
  }
}
