import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Fee {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'UNPAID';
  student: string;
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
  userRole = '';
  outstanding = 0;
  totalCollected = 0;

  paying = false;
  selectedFee: Fee | null = null;

  cardName = '';
  cardNumber = '';
  cardCVV = '';
  searchText = '';

  ngOnInit() {
    // get logged-in user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = user.role || 'student';

    // load existing fees
    const stored = localStorage.getItem('fees');
    this.fees = stored ? JSON.parse(stored) : [];

    // if user is student, ensure they have fees
    if (this.userRole === 'student' && user.name) {
      const existingFees = this.fees.filter(
        f => f.student.toLowerCase() === user.name.toLowerCase()
      );

      if (existingFees.length === 0) {
        const newFees: Fee[] = [
          { id: Date.now() + 1, name: 'Tuition Fee', amount: 10000, dueDate: '2025-12-01', status: 'UNPAID', student: user.name },
          { id: Date.now() + 2, name: 'Library Fee', amount: 800, dueDate: '2025-12-10', status: 'UNPAID', student: user.name },
          { id: Date.now() + 3, name: 'Exam Fee', amount: 1200, dueDate: '2025-12-20', status: 'UNPAID', student: user.name }
        ];
        this.fees.push(...newFees);
        this.saveFees();
      }
    }

    // Admin sample data if no fees exist
    if (this.userRole === 'admin' && this.fees.length === 0) {
      this.fees = [
        { id: 1, name: 'Tuition Fee', amount: 10000, dueDate: '2025-12-01', status: 'UNPAID', student: 'Laila' },
        { id: 2, name: 'Library Fee', amount: 1000, dueDate: '2025-11-30', status: 'PAID', student: 'Omar' },
        { id: 3, name: 'Lab Fee', amount: 1500, dueDate: '2025-12-10', status: 'UNPAID', student: 'Sara' }
      ];
      this.saveFees();
    }

    this.updateView(user);
  }

  saveFees() {
    localStorage.setItem('fees', JSON.stringify(this.fees));
  }

  updateView(user: any) {
    if (this.userRole === 'student' && user.name) {
      this.filteredFees = this.fees.filter(
        f => f.student.toLowerCase() === user.name.toLowerCase()
      );
    } else {
      this.filteredFees = [...this.fees];
    }
    this.calculateTotals();
  }

  calculateTotals() {
    this.outstanding = this.filteredFees
      .filter(f => f.status === 'UNPAID')
      .reduce((sum, f) => sum + f.amount, 0);

    this.totalCollected = this.filteredFees
      .filter(f => f.status === 'PAID')
      .reduce((sum, f) => sum + f.amount, 0);
  }

  search() {
    const term = this.searchText.toLowerCase();
    this.filteredFees = this.fees.filter(f =>
      f.student.toLowerCase().includes(term) || f.name.toLowerCase().includes(term)
    );
    this.calculateTotals();
  }

  openPayment(fee: Fee) {
    this.selectedFee = fee;
    this.paying = true;
  }

  closeModal() {
    this.paying = false;
    this.selectedFee = null;
    this.cardName = this.cardNumber = this.cardCVV = '';
  }

  confirmPayment() {
    if (!this.selectedFee) return;

    this.selectedFee.status = 'PAID';
    this.saveFees();
    this.closeModal();
    this.calculateTotals();
    alert('✅ Payment successful!');
  }

  markPaid(fee: Fee) {
    fee.status = 'PAID';
    this.saveFees();
    this.calculateTotals();
  }

  markUnpaid(fee: Fee) {
    fee.status = 'UNPAID';
    this.saveFees();
    this.calculateTotals();
  }

  downloadInvoice(fee: Fee) {
    const invoice = {
      fee: fee.name,
      amount: fee.amount,
      student: fee.student,
      date: new Date().toLocaleString(),
      status: fee.status
    };

    const blob = new Blob([JSON.stringify(invoice, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fee.student}_${fee.name}_invoice.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
