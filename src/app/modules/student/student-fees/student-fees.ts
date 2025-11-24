import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Fee {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'UNPAID';
  studentUsername: string;
}

@Component({
  selector: 'app-student-fees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-fees.html',
  styleUrls: ['./student-fees.css']
})
export class StudentFees implements OnInit {

  fees: Fee[] = [];
  filteredFees: Fee[] = [];
  payments: any[] = [];

  user: any = {};
  userRole = 'student';
  searchText = '';

  selectedFee: Fee | null = null;
  modalOpen = false;

  // Payment form
  cardName = '';
  cardNumber = '';
  cardCVV = '';

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userRole = this.user.role || 'student';

    const storedFees = JSON.parse(localStorage.getItem('fees') || '[]');
    const storedPayments = JSON.parse(localStorage.getItem('payments') || '[]');

    this.fees = storedFees;
    this.payments = storedPayments;

    // Seed fees ONLY if student has none
    if (this.userRole === 'student') {
      const userFees = this.fees.filter(f => f.studentUsername === this.user.username);

      if (userFees.length === 0) {
        const base = Date.now();

        const newFees: Fee[] = [
          { id: base + 1, name: 'Tuition Fee', amount: 10000, dueDate: '2025-12-01', status: 'UNPAID', studentUsername: this.user.username },
          { id: base + 2, name: 'Library Fee', amount: 800, dueDate: '2025-12-10', status: 'UNPAID', studentUsername: this.user.username },
          { id: base + 3, name: 'Exam Fee', amount: 1200, dueDate: '2025-12-20', status: 'UNPAID', studentUsername: this.user.username }
        ];

        this.fees.push(...newFees);
        this.saveFees();
      }
    }

    this.filterView();
  }

  saveFees() {
    localStorage.setItem('fees', JSON.stringify(this.fees));
  }

  savePayments() {
    localStorage.setItem('payments', JSON.stringify(this.payments));
  }

  filterView() {
    if (this.userRole === 'student') {
      this.filteredFees = this.fees.filter(f => f.studentUsername === this.user.username);
    } else {
      this.filteredFees = [...this.fees];
    }
  }

  search() {
    const term = this.searchText.toLowerCase();

    this.filteredFees = this.fees.filter(f =>
      f.name.toLowerCase().includes(term) ||
      f.studentUsername.toLowerCase().includes(term)
    );

    if (this.userRole === 'student') {
      this.filteredFees = this.filteredFees.filter(
        f => f.studentUsername === this.user.username
      );
    }
  }

  openPayModal(fee: Fee) {
    this.selectedFee = fee;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedFee = null;
    this.cardName = this.cardNumber = this.cardCVV = '';
  }

  confirmPayment() {
    if (!this.selectedFee) return;

    this.selectedFee.status = 'PAID';
    this.saveFees();

    this.payments.push({
      invoice: this.selectedFee.name,
      amount: this.selectedFee.amount,
      studentUsername: this.selectedFee.studentUsername,
      date: new Date().toISOString().split('T')[0],
      ref: Math.floor(Math.random() * 999999)
    });

    this.savePayments();
    this.closeModal();
  }

  downloadInvoice(fee: Fee) {
    const invoice = {
      Invoice: fee.name,
      Amount: fee.amount,
      Student: fee.studentUsername,
      Due: fee.dueDate,
      Status: fee.status,
      DateGenerated: new Date().toLocaleString()
    };

    const blob = new Blob([JSON.stringify(invoice, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fee.studentUsername}_${fee.name}_invoice.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
