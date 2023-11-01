export enum TermsOfPaymentEnum {
  PREPAYMENT = 0,
  DAY_1 = 1,
  DAY_5 = 5,
  DAY_7 = 7,
  DAY_14 = 14,
  DAY_30 = 30,
  DAY_45 = 45,
  DAY_60 = 60,
  DAY_90 = 90,
}

export const termsOfPayment: Record<
  TermsOfPaymentEnum,
  { id: TermsOfPaymentEnum; name: string }
> = {
  [TermsOfPaymentEnum.PREPAYMENT]: {
    id: TermsOfPaymentEnum.PREPAYMENT,
    name: 'Prepayment',
  },
  [TermsOfPaymentEnum.DAY_1]: {
    id: TermsOfPaymentEnum.DAY_1,
    name: '1 Day',
  },
  [TermsOfPaymentEnum.DAY_5]: {
    id: TermsOfPaymentEnum.DAY_5,
    name: '5 Days',
  },
  [TermsOfPaymentEnum.DAY_7]: {
    id: TermsOfPaymentEnum.DAY_7,
    name: '7 Days',
  },
  [TermsOfPaymentEnum.DAY_14]: {
    id: TermsOfPaymentEnum.DAY_14,
    name: '14 Days',
  },
  [TermsOfPaymentEnum.DAY_30]: {
    id: TermsOfPaymentEnum.DAY_30,
    name: '30 Days',
  },
  [TermsOfPaymentEnum.DAY_45]: {
    id: TermsOfPaymentEnum.DAY_45,
    name: '45 Days',
  },
  [TermsOfPaymentEnum.DAY_60]: {
    id: TermsOfPaymentEnum.DAY_60,
    name: '60 Days',
  },
  [TermsOfPaymentEnum.DAY_90]: {
    id: TermsOfPaymentEnum.DAY_90,
    name: '90 Days',
  },
};
