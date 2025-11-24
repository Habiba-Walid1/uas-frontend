import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPayroll } from './staff-payroll';

describe('StaffPayroll', () => {
  let component: StaffPayroll;
  let fixture: ComponentFixture<StaffPayroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffPayroll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffPayroll);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
