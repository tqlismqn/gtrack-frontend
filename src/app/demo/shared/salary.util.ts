import { Salary } from './models';

export function totalSalary(salary: Salary): number {
  return salary.base + salary.bonus + salary.trips + salary.perDiem - salary.deductions;
}
