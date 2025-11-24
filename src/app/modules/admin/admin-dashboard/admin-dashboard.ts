import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {

  totalUsers = 0;
  totalStudents = 0;
  totalStaff = 0;
  totalRevenue = 0;

  ngOnInit(): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const fees = JSON.parse(localStorage.getItem('fees') || '[]');

    this.totalUsers = users.length;
    this.totalStudents = users.filter((u: any) => u.role === 'student').length;
    this.totalStaff = users.filter((u: any) => u.role === 'staff').length;

    this.totalRevenue = fees
      .filter((f: any) => f.status === 'PAID')
      .reduce((sum: number, f: any) => sum + f.amount, 0);
  }

}
