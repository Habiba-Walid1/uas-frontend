import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {

  user: any = null;

  editing = false;
  editForm: any = {};

  constructor() {

    // FIXED LOGIN CHECK
    const session = sessionStorage.getItem('activeUser');
    if (!session) {
      window.location.href = '/login';
      return;
    }

    // LOAD USER FROM LOCAL STORAGE
    const stored = localStorage.getItem('user');
    if (stored) {
      this.user = JSON.parse(stored);
    }
  }

  openEdit() {
    this.editing = true;
    this.editForm = { ...this.user };
  }

  closeEdit() {
    this.editing = false;
  }

  changePicture(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.editForm.picture = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  saveChanges() {
    this.user = { ...this.editForm };

    localStorage.setItem('user', JSON.stringify(this.user));
    sessionStorage.setItem('activeUser', JSON.stringify(this.user));

    this.editing = false;
  }
}
