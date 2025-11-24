import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

interface BudgetRecord {
  id: number;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  date: string;
  department: string;
}

@Component({
  selector: 'app-department-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './department-budget.html',
  styleUrls: ['./department-budget.css']
})
export class DepartmentBudget implements OnInit {

  records: BudgetRecord[] = [];
  filtered: BudgetRecord[] = [];

  totalIncome = 0;
  totalExpenses = 0;
  netBalance = 0;

  entryType: 'income' | 'expense' = 'income';
  title = '';
  amount: number | null = null;
  department = '';
  date = '';
  modalOpen = false;

  // NGX Chart Data
  pieData: any[] = [];
  barData: any[] = [];

  // DARK MODE COLORS (auto theme matching)
  textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim();
  borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
  cardColor = getComputedStyle(document.documentElement).getPropertyValue('--card').trim();

  colorScheme = {
    domain: ['#16a34a', '#ef4444']
  };

  barColorScheme = {
    domain: ['#8b5cf6', '#3b82f6', '#14b8a6']
  };

  ngOnInit() {
    this.records = JSON.parse(localStorage.getItem('budget') || '[]');
    this.filtered = [...this.records];
    this.updateTotals();
    this.updateCharts();
  }

  saveData() {
    localStorage.setItem('budget', JSON.stringify(this.records));
  }

  openAddModal() {
    this.modalOpen = true;
    this.resetForm();
  }

  closeModal() {
    this.modalOpen = false;
  }

  resetForm() {
    this.entryType = 'income';
    this.title = '';
    this.amount = null;
    this.department = '';
    this.date = '';
  }

  saveRecord() {
    if (!this.title || !this.amount || !this.date || !this.department) {
      alert("All fields are required.");
      return;
    }

    this.records.push({
      id: Date.now(),
      type: this.entryType,
      title: this.title,
      amount: this.amount,
      date: this.date,
      department: this.department
    });

    this.saveData();
    this.closeModal();
    this.refresh();
  }

  deleteRecord(id: number) {
    this.records = this.records.filter(r => r.id !== id);
    this.saveData();
    this.refresh();
  }

  search(term: string) {
    term = term.toLowerCase();
    this.filtered = this.records.filter(r =>
      r.title.toLowerCase().includes(term) ||
      r.department.toLowerCase().includes(term)
    );
  }

  refresh() {
    this.filtered = [...this.records];
    this.updateTotals();
    this.updateCharts();
  }

  updateTotals() {
    this.totalIncome = this.records
      .filter(r => r.type === 'income')
      .reduce((s, r) => s + r.amount, 0);

    this.totalExpenses = this.records
      .filter(r => r.type === 'expense')
      .reduce((s, r) => s + r.amount, 0);

    this.netBalance = this.totalIncome - this.totalExpenses;
  }

  updateCharts() {
    this.pieData = [
      { name: 'Income', value: this.totalIncome },
      { name: 'Expenses', value: this.totalExpenses }
    ];

    const grouped: any = {};

    this.records.forEach(r => {
      const month = new Date(r.date).toLocaleString('default', { month: 'short' });

      if (!grouped[month]) grouped[month] = 0;

      grouped[month] += r.type === 'income' ? r.amount : -r.amount;
    });

    this.barData = Object.keys(grouped).map(m => ({
      name: m, value: grouped[m]
    }));
  }

  exportReport() {
    const report = {
      generated: new Date().toLocaleString(),
      totalIncome: this.totalIncome,
      totalExpenses: this.totalExpenses,
      netBalance: this.netBalance,
      records: this.records
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "Department_Budget_Report.json";
    a.click();

    URL.revokeObjectURL(url);
  }

}
