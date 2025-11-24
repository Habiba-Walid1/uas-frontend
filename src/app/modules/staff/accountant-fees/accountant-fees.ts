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
  selector: 'app-accountant-fees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accountant-fees.html',
  styleUrls: ['./accountant-fees.css']
})
export class AccountantFees implements OnInit {

  fees: Fee[] = [];
  filteredFees: Fee[] = [];
  users: any[] = [];

  searchText = '';
  modalOpen = false;
  editing = false;

  // fields for Add / Edit Fee
  editFeeId: number | null = null;
  feeName = '';
  feeAmount: number | null = null;
  feeDueDate = '';
  feeStudent = '';

  ngOnInit() {
    this.fees = JSON.parse(localStorage.getItem('fees') || '[]');
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    this.filteredFees = [...this.fees];
  }

  saveFees() {
    localStorage.setItem('fees', JSON.stringify(this.fees));
    this.filteredFees = [...this.fees];
  }

  /* ------------------- SEARCH -------------------- */
    search() {
  const term = (this.searchText || '').toLowerCase();

  this.filteredFees = this.fees.filter(f => {

    // protect against missing fields
    const feeName = f.name ? f.name.toLowerCase() : '';
    const studentField = f.student ? f.student.toLowerCase() : '';

    const user = this.users.find(
      u =>
        (u.username && u.username.toLowerCase() === studentField) ||
        (u.fullname && u.fullname.toLowerCase() === studentField)
    );

    const full = user?.fullname ? user.fullname.toLowerCase() : '';
    const username = user?.username ? user.username.toLowerCase() : '';

    return (
      feeName.includes(term) ||
      studentField.includes(term) ||
      full.includes(term) ||
      username.includes(term)
    );
  });
}




  /* ------------------- ADD NEW FEE -------------------- */
  openAddModal() {
    this.modalOpen = true;
    this.editing = false;
    this.resetForm();
  }

  /* ------------------- EDIT FEE -------------------- */
  openEditModal(fee: Fee) {
    this.modalOpen = true;
    this.editing = true;

    this.editFeeId = fee.id;
    this.feeName = fee.name;
    this.feeAmount = fee.amount;
    this.feeDueDate = fee.dueDate;
    this.feeStudent = fee.student;
  }

  /* ------------------- DELETE -------------------- */
  deleteFee(id: number) {
    this.fees = this.fees.filter(f => f.id !== id);
    this.saveFees();
  }

  /* ------------------- MARK PAID / UNPAID -------------------- */
  toggleStatus(fee: Fee) {
    fee.status = fee.status === 'PAID' ? 'UNPAID' : 'PAID';
    this.saveFees();
  }

  /* ------------------- SUBMIT NEW / EDIT -------------------- */
  saveFee() {
    if (!this.feeName || !this.feeAmount || !this.feeDueDate || !this.feeStudent) {
      alert("All fields are required!");
      return;
    }

    if (this.editing && this.editFeeId !== null) {
      // Edit mode
      const fee = this.fees.find(f => f.id === this.editFeeId);
      if (fee) {
        fee.name = this.feeName;
        fee.amount = this.feeAmount;
        fee.dueDate = this.feeDueDate;
        fee.student = this.feeStudent;
      }
    } else {
      // Add new
      this.fees.push({
        id: Date.now(),
        name: this.feeName,
        amount: this.feeAmount!,
        dueDate: this.feeDueDate,
        status: 'UNPAID',
        student: this.feeStudent
      });
    }

    this.saveFees();
    this.closeModal();
  }

  /* ------------------- RESET FORM -------------------- */
  resetForm() {
    this.editFeeId = null;
    this.feeName = '';
    this.feeAmount = null;
    this.feeDueDate = '';
    this.feeStudent = '';
  }

  /* ------------------- CLOSE MODAL -------------------- */
  closeModal() {
    this.modalOpen = false;
    this.resetForm();
  }

  /* ------------------- DOWNLOAD INVOICE -------------------- */
  downloadInvoice(fee: Fee) {
    const invoice = {
      invoice: fee.name,
      amount: fee.amount,
      student: fee.student,
      due: fee.dueDate,
      status: fee.status,
      generatedOn: new Date().toLocaleString(),
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
