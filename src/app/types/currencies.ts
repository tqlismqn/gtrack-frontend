export enum Currencies {
  EUR = 'EUR',
  CZK = 'CZK',
  USD = 'USD',
  GBP = 'GBP',
  PLN = 'PLN',
  RON = 'RON',
  BGN = 'BGN',
}

export const CurrenciesArray = Object.values(Currencies);

export type CustomCurrencies = {
  ID: Currencies;
  rate: number;
};

export type AdminCurrenciesResponse = {
  id: Currencies;
  rate: number;
};
export type AdminCurrencies = AdminCurrenciesResponse;
