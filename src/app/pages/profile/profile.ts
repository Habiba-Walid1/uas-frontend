import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  changingPassword = false;

  passwordForm = {
    current: '',
    new: '',
    confirm: ''
  };

  user: any = null;
  editedUser: any = null;

  editing = false;
  profileImage: string | null = null;

  constructor(private router: Router) {}
ngOnInit() {
  const saved = localStorage.getItem("currentUser");
  this.user = saved ? JSON.parse(saved) : null;

  if (!this.user) {
    this.router.navigate(['/login']);
    return;
  }

  this.editedUser = JSON.parse(JSON.stringify(this.user));
  this.profileImage = this.user.profileImage || null;
}


uploadImage(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result as string;

    // Update current user object
    this.user.profileImage = base64;
    this.editedUser.profileImage = base64;
    this.profileImage = base64;

    // Save to currentUser in storage
    localStorage.setItem("currentUser", JSON.stringify(this.user));

    // Update users list too
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const idx = allUsers.findIndex((u: any) => u.email === this.user.email);

    if (idx !== -1) {
      allUsers[idx].profileImage = base64;
      localStorage.setItem("users", JSON.stringify(allUsers));
    }
  };

  reader.readAsDataURL(file);
}


  toggleEdit() {
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
    this.editedUser = JSON.parse(JSON.stringify(this.user));
  }

  saveChanges() {
    this.user = JSON.parse(JSON.stringify(this.editedUser));
    localStorage.setItem('currentUser', JSON.stringify(this.user));

    // Update global users list
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const index = allUsers.findIndex((u: any) => u.username === this.user.username);

    if (index !== -1) {
      allUsers[index] = this.user;
      localStorage.setItem('users', JSON.stringify(allUsers));
    }

    this.editing = false;
  }

  savePassword() {
    if (this.passwordForm.new !== this.passwordForm.confirm) {
      alert('New passwords do not match.');
      return;
    }

    if (this.passwordForm.current !== this.user.password) {
      alert('Current password is incorrect.');
      return;
    }

    // Update user password
    this.user.password = this.passwordForm.new;

    // Update user list
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const index = allUsers.findIndex((u: any) => u.email === this.user.email);

    if (index !== -1) {
      allUsers[index].password = this.passwordForm.new;
      localStorage.setItem('users', JSON.stringify(allUsers));
    }

    localStorage.setItem('currentUser', JSON.stringify(this.user));

    alert('Password updated successfully!');

    // Reset form
    this.passwordForm = { current: '', new: '', confirm: '' };
    this.changingPassword = false;
  }

  logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}
