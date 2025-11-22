import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { FormsModule } from '@angular/forms';

interface Entry {
  id: number;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  date: string;
  description: string;
  invoice?: any;
}

@Component({
  selector: 'app-department-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-budget.html',
  styleUrls: ['./department-budget.css']
})
export class DepartmentBudget implements OnInit {

  items: Entry[] = [];

  totalBudget = 300000;
  incomeTotal = 0;
  expenseTotal = 0;
  balance = 0;

  show = false;
  form: any = {};

  pieChart: any;
  barChart: any;

  ngOnInit() {
    const saved = localStorage.getItem("deptBudget");
    this.items = saved ? JSON.parse(saved) : [];

    this.updateTotals();
    setTimeout(() => this.renderCharts(), 200);
  }


  /* ================= SAVE ENTRY ================= */
  save() {
    this.items.push({
      id: Date.now(),
      ...this.form
    });

    localStorage.setItem("deptBudget", JSON.stringify(this.items));

    this.updateTotals();
    this.refreshCharts();
    this.close();
  }


  /* ================= TOTALS ================= */
  updateTotals() {
    this.incomeTotal = this.items
      .filter(i => i.type === 'INCOME')
      .reduce((a, b) => a + b.amount, 0);

    this.expenseTotal = this.items
      .filter(i => i.type === 'EXPENSE')
      .reduce((a, b) => a + b.amount, 0);

    this.balance = this.totalBudget + this.incomeTotal - this.expenseTotal;
  }


  /* ================= INVOICE ================= */
  upload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.form.invoice = reader.result;
    reader.readAsDataURL(file);
  }

  download(x: Entry) {
    const blob = new Blob([JSON.stringify(x, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${x.category}_invoice.json`;
    a.click();

    URL.revokeObjectURL(url);
  }


  /* ================= DELETE ================= */
  remove(id: number) {
    this.items = this.items.filter(x => x.id !== id);

    localStorage.setItem("deptBudget", JSON.stringify(this.items));

    this.updateTotals();
    this.refreshCharts();
  }


  /* ================= MODAL ================= */
  openModal() { this.show = true; }
  close() { this.show = false; }


  /* ================= CHARTS ================= */
  renderCharts() {
    const dataByCat = this.items.reduce((acc: any, x) => {
      acc[x.category] = (acc[x.category] || 0) + x.amount;
      return acc;
    }, {});

    this.pieChart = new Chart(document.getElementById('pieChart') as HTMLCanvasElement, {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          data: [this.incomeTotal, this.expenseTotal],
          backgroundColor: ['#22c55e', '#ef4444']
        }]
      }
    });

    this.barChart = new Chart(document.getElementById('barChart') as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels: Object.keys(dataByCat),
        datasets: [{
          label: 'Expenses By Category',
          data: Object.values(dataByCat),
          backgroundColor: '#3b82f6'
        }]
      }
    });
  }

  refreshCharts() {
    if (this.pieChart) this.pieChart.destroy();
    if (this.barChart) this.barChart.destroy();
    this.renderCharts();
  }
}
