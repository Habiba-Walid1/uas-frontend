import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = new Router();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'guest';

  // protect admin pages
  if ((state.url.includes('department-budget') || state.url.includes('staff-payroll')) && role !== 'admin') {
    alert('Access denied: Admins only');
    router.navigate(['/']);
    return false;
  }

  // protect student-only page
  if (state.url.includes('student-fees') && role !== 'student' && role !== 'admin') {
    alert('Access denied: Students only');
    router.navigate(['/']);
    return false;
  }

  return true;
};
