import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PayrollRecord {
  id: number;
  staffName: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string;
}

@Component({
  selector: 'app-staff-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-payroll.html',
  styleUrls: ['./staff-payroll.css']
})
export class StaffPayroll implements OnInit {

  payroll: PayrollRecord[] = [];
  filteredPayroll: PayrollRecord[] = [];

  // Form fields
  staffName = '';
  baseSalary: number | null = null;
  allowances: number | null = null;
  deductions: number | null = null;
  month = '';

  searchText = '';

  modalOpen = false;
  editing = false;
  editId: number | null = null;

  ngOnInit() {
    this.payroll = JSON.parse(localStorage.getItem('payroll') || '[]');
    this.filteredPayroll = [...this.payroll];
  }

  saveData() {
    localStorage.setItem('payroll', JSON.stringify(this.payroll));
    this.filteredPayroll = [...this.payroll];
  }

  /* ------------------- SEARCH ------------------- */
  search() {
    const term = this.searchText.toLowerCase();
    this.filteredPayroll = this.payroll.filter(p =>
      p.staffName.toLowerCase().includes(term) ||
      p.month.toLowerCase().includes(term)
    );
  }

  /* ------------------- OPEN ADD MODAL ------------------- */
  openAddModal() {
    this.modalOpen = true;
    this.editing = false;
    this.resetForm();
  }

  /* ------------------- OPEN EDIT MODAL ------------------- */
  openEditModal(record: PayrollRecord) {
    this.modalOpen = true;
    this.editing = true;

    this.editId = record.id;
    this.staffName = record.staffName;
    this.baseSalary = record.baseSalary;
    this.allowances = record.allowances;
    this.deductions = record.deductions;
    this.month = record.month;
  }

  /* ------------------- DELETE ------------------- */
  deleteRecord(id: number) {
    this.payroll = this.payroll.filter(p => p.id !== id);
    this.saveData();
  }

  /* ------------------- ADD / EDIT SAVE ------------------- */
  saveRecord() {
    if (!this.staffName || this.baseSalary === null || this.allowances === null ||
        this.deductions === null || !this.month) {
      alert("All fields are required.");
      return;
    }

    const net = this.baseSalary + this.allowances - this.deductions;

    if (this.editing && this.editId !== null) {
      const rec = this.payroll.find(p => p.id === this.editId);
      if (rec) {
        rec.staffName = this.staffName;
        rec.baseSalary = this.baseSalary;
        rec.allowances = this.allowances;
        rec.deductions = this.deductions;
        rec.netSalary = net;
        rec.month = this.month;
      }
    } else {
      this.payroll.push({
        id: Date.now(),
        staffName: this.staffName,
        baseSalary: this.baseSalary,
        allowances: this.allowances,
        deductions: this.deductions,
        netSalary: net,
        month: this.month
      });
    }

    this.saveData();
    this.closeModal();
  }

  /* ------------------- RESET FORM ------------------- */
  resetForm() {
    this.editId = null;
    this.staffName = '';
    this.baseSalary = null;
    this.allowances = null;
    this.deductions = null;
    this.month = '';
  }

  /* ------------------- CLOSE MODAL ------------------- */
  closeModal() {
    this.modalOpen = false;
    this.resetForm();
  }

  /* ------------------- REPORT GENERATION ------------------- */
  generateMonthlyReport() {
    const monthName = prompt("Enter month to export (e.g., December 2025)");
    if (!monthName) return;

    const report = this.payroll.filter(p => p.month.toLowerCase() === monthName.toLowerCase());

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Payroll_Report_${monthName.replace(/\s+/g, '_')}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

}
