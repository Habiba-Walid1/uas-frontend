import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-staff-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-payroll.html',
  styleUrls: ['./staff-payroll.css']
})
export class StaffPayroll implements OnInit {

  staffList: any[] = [];
  modalOpen = false;

  form = { name: '', baseSalary: 0, allowances: 0, deductions: 0 };
  userRole = '';
  currentUserName = '';

  totalAllowances = 0;
  totalDeductions = 0;
  totalNet = 0;

  chart: any;

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = user.role || 'staff';
    this.currentUserName = user.name || '';

    const stored = localStorage.getItem('staffPayroll');
    this.staffList = stored ? JSON.parse(stored) : [];

    // Staff sees only their own record
    if (this.userRole === 'staff') {
      this.staffList = this.staffList.filter(s => s.name === this.currentUserName);
    }

    this.updateSummary();
    this.renderChart();
  }

  openModal() { this.modalOpen = true; }
  closeModal() { this.modalOpen = false; }

  save() {
    const net = this.form.baseSalary + this.form.allowances - this.form.deductions;

    const entry = {
      ...this.form,
      net,
      invoice: {
        employee: this.form.name,
        date: new Date().toLocaleString(),
        base: this.form.baseSalary,
        allowances: this.form.allowances,
        deductions: this.form.deductions,
        net
      }
    };

    this.staffList.push(entry);
    localStorage.setItem('staffPayroll', JSON.stringify(this.staffList));

    this.updateSummary();
    this.renderChart();

    this.modalOpen = false;
    this.form = { name: '', baseSalary: 0, allowances: 0, deductions: 0 };
  }

  delete(i: number) {
    this.staffList.splice(i, 1);
    localStorage.setItem('staffPayroll', JSON.stringify(this.staffList));
    this.updateSummary();
    this.renderChart();
  }

  downloadInvoice(entry: any) {
    const blob = new Blob([JSON.stringify(entry.invoice, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${entry.name}_invoice.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  updateSummary() {
    this.totalAllowances = this.staffList.reduce((acc, x) => acc + x.allowances, 0);
    this.totalDeductions = this.staffList.reduce((acc, x) => acc + x.deductions, 0);
    this.totalNet = this.staffList.reduce((acc, x) => acc + x.net, 0);
  }

  renderChart() {
    const ctx = document.getElementById('payrollChart') as any;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Base Salaries', 'Allowances', 'Deductions'],
        datasets: [{
          data: [
            this.staffList.reduce((acc, x) => acc + x.baseSalary, 0),
            this.totalAllowances,
            this.totalDeductions
          ],
          backgroundColor: ['#2563eb', '#16a34a', '#dc2626']
        }]
      }
    });
  }
}
