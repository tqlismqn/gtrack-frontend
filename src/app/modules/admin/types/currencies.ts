import { Currencies } from '../../../types/currencies';

export type AdminCurrenciesResponse = {
  id: Currencies;
  rate: number;
};
export type AdminCurrencies = AdminCurrenciesResponse;
