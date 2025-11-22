import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'signup', loadComponent: () => import('./pages/signup/signup').then(m => m.Signup) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile) },

  { path: 'staff-payroll', loadComponent: () => import('./pages/staff-payroll/staff-payroll').then(m => m.StaffPayroll) },
  { path: 'department-budget', loadComponent: () => import('./pages/department-budget/department-budget').then(m => m.DepartmentBudget) },

 { 
  path: 'student-fees', 
  loadComponent: () =>
    import('./pages/student-fees/student-fees')
      .then(m => m.StudentFees) 
},

];
