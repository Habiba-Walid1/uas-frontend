import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css']
})
export class ManageUsers implements OnInit {

  users: any[] = [];
  filtered: any[] = [];
  searchText = '';

  editingUser: any = null;
  modalOpen = false;

  ngOnInit(): void {
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    this.filtered = [...this.users];
  }

  search() {
    const term = this.searchText.toLowerCase();
    this.filtered = this.users.filter(u =>
      u.fullname.toLowerCase().includes(term) ||
      u.username.toLowerCase().includes(term)
    );
  }

  openEdit(user: any) {
    this.editingUser = JSON.parse(JSON.stringify(user));
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingUser = null;
  }

  saveChanges() {
    const index = this.users.findIndex(u => u.email === this.editingUser.email);
    if (index !== -1) {
      this.users[index] = this.editingUser;
    }

    localStorage.setItem('users', JSON.stringify(this.users));
    this.filtered = [...this.users];
    this.closeModal();
  }

  deleteUser(email: string) {
    if (confirm("Delete this user?")) {
      this.users = this.users.filter(u => u.email !== email);
      localStorage.setItem('users', JSON.stringify(this.users));
      this.filtered = [...this.users];
    }
  }

}
