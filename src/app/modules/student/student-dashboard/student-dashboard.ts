import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule,
  ],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboard implements OnInit {

  user: any = null;

  nextInstallment = {
    date: 'March 15, 2025',
    amount: 4500,
    status: 'upcoming'
  };

  totalDue = 12500;
  totalPaid = 8000;

  ngOnInit(): void {
    const saved = localStorage.getItem('currentUser');
    this.user = saved ? JSON.parse(saved) : null;
  }
}
