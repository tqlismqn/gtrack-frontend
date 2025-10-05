import { DocKey, DocState, Docs } from './models';

export const DOC_ICONS: Record<DocKey, string> = {
  passport: 'passport',
  visa: 'flight',
  license: 'badge',
  code95: 'workspace_premium',
  tachograph: 'timer',
  medical: 'health_and_safety',
  adr: 'local_shipping',
};

export function daysToState(days: number): DocState {
  if (days < 0) {
    return 'bad';
  }
  if (days <= 30) {
    return 'warn';
  }
  return 'ok';
}

export function worstDocState(docs: Docs): DocState {
  let worst: DocState = 'ok';
  for (const key of Object.keys(docs) as DocKey[]) {
    const doc = docs[key];
    const daysLeft = Math.round((doc.expires - Date.now()) / (1000 * 60 * 60 * 24));
    const state = doc.uploaded ? daysToState(daysLeft) : 'bad';
    if (state === 'bad') {
      return 'bad';
    }
    if (state === 'warn' && worst === 'ok') {
      worst = 'warn';
    }
  }
  return worst;
}
