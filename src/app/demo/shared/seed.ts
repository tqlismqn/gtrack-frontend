import { Driver, DocKey, Docs } from './models';
import { uuid } from './uuid';

const DAY = 24 * 60 * 60 * 1000;

function buildDocs(overrides: Partial<Record<DocKey, Partial<Docs[DocKey]>>> = {}): Docs {
  const now = Date.now();
  const docs: Docs = {
    passport: { expires: now + 180 * DAY, uploaded: true },
    visa: { expires: now + 120 * DAY, uploaded: true },
    license: { expires: now + 365 * DAY, uploaded: true },
    code95: { expires: now + 90 * DAY, uploaded: true },
    tachograph: { expires: now + 45 * DAY, uploaded: true },
    medical: { expires: now + 240 * DAY, uploaded: true },
    adr: { expires: now + 150 * DAY, uploaded: true },
  };

  for (const key of Object.keys(overrides) as DocKey[]) {
    const override = overrides[key];
    if (!override) {
      continue;
    }
    const next: Docs[DocKey] = { ...docs[key], ...override };
    docs[key] = next;
  }

  return docs;
}

function driver(partial: Partial<Driver>): Driver {
  return {
    id: uuid(),
    fullName: 'Неизвестный Водитель',
    rc: '820101/1234',
    email: 'driver@example.com',
    phone: '+420 777 000 000',
    status: 'Active',
    citizenship: 'CZ',
    workplace: 'Praha',
    hireDate: new Date().toISOString().slice(0, 10),
    contractType: 'Бессрочный',
    pasSouhlas: true,
    propiskaCZ: true,
    docs: buildDocs(),
    salary: {
      base: 38000,
      bonus: 4500,
      deductions: 1200,
      trips: 5,
      perDiem: 3200,
    },
    ...partial,
  };
}

export const SEED: Driver[] = [
  driver({
    fullName: 'Jan Novák',
    rc: '780312/5566',
    email: 'jan.novak@example.com',
    phone: '+420 777 001 100',
    status: 'Active',
    citizenship: 'CZ',
    workplace: 'Praha',
  }),
  driver({
    fullName: 'Petra Svobodová',
    rc: '860921/7890',
    email: 'petra.svobodova@example.com',
    phone: '+420 777 002 200',
    status: 'OnLeave',
    citizenship: 'EU',
    workplace: 'Praha',
    docs: buildDocs({ visa: { expires: Date.now() + 20 * DAY } }),
  }),
  driver({
    fullName: 'Michal Konečný',
    rc: '900105/1123',
    email: 'michal.konecny@example.com',
    phone: '+420 777 003 300',
    status: 'Active',
    citizenship: 'CZ',
    workplace: 'Kladno',
    docs: buildDocs({ tachograph: { expires: Date.now() - 3 * DAY } }),
  }),
  driver({
    fullName: 'Alexandr Petrov',
    rc: '850401/4455',
    email: 'alexandr.petrov@example.com',
    phone: '+420 777 004 400',
    status: 'Inactive',
    citizenship: 'Non-EU',
    workplace: 'Praha',
    pasSouhlas: false,
    docs: buildDocs({ passport: { expires: Date.now() - 10 * DAY } }),
  }),
  driver({
    fullName: 'Lucie Veselá',
    rc: '930706/9988',
    email: 'lucie.vesela@example.com',
    phone: '+420 777 005 500',
    status: 'Active',
    citizenship: 'EU',
    workplace: 'Kladno',
    docs: buildDocs({ medical: { expires: Date.now() + 12 * DAY } }),
  }),
  driver({
    fullName: 'Martin Horák',
    rc: '740214/3344',
    email: 'martin.horak@example.com',
    phone: '+420 777 006 600',
    status: 'Active',
    citizenship: 'CZ',
    workplace: 'Praha',
    salary: {
      base: 42000,
      bonus: 5200,
      deductions: 1800,
      trips: 7,
      perDiem: 4100,
    },
  }),
  driver({
    fullName: 'Eva Říhová',
    rc: '960305/6677',
    email: 'eva.rihova@example.com',
    phone: '+420 777 007 700',
    status: 'OnLeave',
    citizenship: 'CZ',
    workplace: 'Praha',
    docs: buildDocs({ adr: { uploaded: false } }),
  }),
  driver({
    fullName: 'Tomáš Fiala',
    rc: '820915/2211',
    email: 'tomas.fiala@example.com',
    phone: '+420 777 008 800',
    status: 'Active',
    citizenship: 'Non-EU',
    workplace: 'Kladno',
    docs: buildDocs({ visa: { expires: Date.now() + 5 * DAY } }),
  }),
  driver({
    fullName: 'Marta Králová',
    rc: '790120/7788',
    email: 'marta.kralova@example.com',
    phone: '+420 777 009 900',
    status: 'Inactive',
    citizenship: 'EU',
    workplace: 'Praha',
    docs: buildDocs({ license: { expires: Date.now() - 30 * DAY } }),
  }),
];

const FIRST_NAMES = ['Jan', 'Pavel', 'Lucie', 'Radek', 'Michaela', 'Filip', 'Klára'];
const LAST_NAMES = ['Černý', 'Malá', 'Dvořák', 'Němcová', 'Urban', 'Veselý', 'Hrubá'];
const EMAIL_DOMAINS = ['example.com', 'gtrack.test', 'mail.cz'];
const STATUSES: Driver['status'][] = ['Active', 'OnLeave', 'Inactive'];
const CITIZENSHIPS: Driver['citizenship'][] = ['CZ', 'EU', 'Non-EU'];
const WORKPLACES: Driver['workplace'][] = ['Praha', 'Kladno'];
const CONTRACTS: Driver['contractType'][] = ['Срочный', 'Бессрочный'];

export function randomDriver(): Driver {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  const citizenship = CITIZENSHIPS[Math.floor(Math.random() * CITIZENSHIPS.length)];
  const workplace = WORKPLACES[Math.floor(Math.random() * WORKPLACES.length)];
  const contractType = CONTRACTS[Math.floor(Math.random() * CONTRACTS.length)];
  const emailDomain = EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)];

  const rc = `${Math.floor(70 + Math.random() * 30)}${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}${String(
    Math.floor(Math.random() * 28) + 1,
  ).padStart(2, '0')}/${Math.floor(1000 + Math.random() * 8999)}`;

  const docs = buildDocs();
  const docKeys = Object.keys(docs) as DocKey[];
  const affected = docKeys[Math.floor(Math.random() * docKeys.length)];
  const randomOffset = Math.floor(Math.random() * 120) - 30; // +/- 30 days
  docs[affected] = {
    ...docs[affected],
    expires: Date.now() + randomOffset * DAY,
    uploaded: Math.random() > 0.15,
  };

  return {
    id: uuid(),
    fullName: `${first} ${last}`,
    rc,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${emailDomain}`,
    phone: `+420 777 ${Math.floor(100000 + Math.random() * 899999)}`,
    status,
    citizenship,
    workplace,
    hireDate: new Date(Date.now() - Math.floor(Math.random() * 365) * DAY).toISOString().slice(0, 10),
    contractType,
    pasSouhlas: Math.random() > 0.2,
    propiskaCZ: Math.random() > 0.3,
    docs,
    salary: {
      base: 35000 + Math.floor(Math.random() * 12000),
      bonus: Math.floor(Math.random() * 6000),
      deductions: Math.floor(Math.random() * 4000),
      trips: Math.floor(Math.random() * 10),
      perDiem: 2500 + Math.floor(Math.random() * 4000),
    },
  };
}

export function reseed(): Driver[] {
  return SEED.map((item) => ({ ...item, id: uuid() }));
}
