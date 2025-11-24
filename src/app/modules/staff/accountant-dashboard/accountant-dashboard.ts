import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accountant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accountant-dashboard.html',
  styleUrls: ['./accountant-dashboard.css']
})
export class AccountantDashboard {

  fees = JSON.parse(localStorage.getItem('fees') || '[]');
  payroll = JSON.parse(localStorage.getItem('payroll') || '[]');
  budget = JSON.parse(localStorage.getItem('budget') || '[]');
  users = JSON.parse(localStorage.getItem('users') || '[]');

  get totalCollected() {
    return this.fees.filter((f:any) => f.status === 'PAID')
      .reduce((s:any, f:any) => s + f.amount, 0);
  }

  get outstanding() {
    return this.fees.filter((f:any) => f.status === 'UNPAID')
      .reduce((s:any, f:any) => s + f.amount, 0);
  }

  get totalStaff() {
    return this.users.filter((u:any) => u.role === 'staff').length;
  }

}
