export type DocKey =
  | 'passport'
  | 'visa'
  | 'license'
  | 'code95'
  | 'tachograph'
  | 'medical'
  | 'adr';

export type DocState = 'ok' | 'warn' | 'bad';

export interface DocItem {
  expires: number;
  uploaded: boolean;
}

export type Docs = Record<DocKey, DocItem>;

export interface Salary {
  base: number;
  bonus: number;
  deductions: number;
  trips: number;
  perDiem: number;
}

export interface Driver {
  id: string;
  fullName: string;
  rc: string;
  email: string;
  phone: string;
  status: 'Active' | 'OnLeave' | 'Inactive';
  citizenship: 'CZ' | 'EU' | 'Non-EU';
  workplace: 'Praha' | 'Kladno';
  hireDate: string;
  contractType: 'Срочный' | 'Бессрочный';
  pasSouhlas: boolean;
  propiskaCZ: boolean;
  docs: Docs;
  salary: Salary;
}

export interface DriverFilters {
  query: string;
  status: Driver['status'] | 'all';
  docState: DocState | 'all';
  citizenship: Driver['citizenship'] | 'all';
  workplace: Driver['workplace'] | 'all';
  problemsOnly: boolean;
}

export interface DriversSummary {
  total: number;
  active: number;
  onLeave: number;
  inactive: number;
  docsOk: number;
  docsWarn: number;
  docsBad: number;
}
