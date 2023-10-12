import { Customer, CustomerResponse } from '../types/customers.type';

export class CustomersUtils {
  static customerResponseToDTO(value: CustomerResponse): Customer {
    return {
      ...value,
      created_at: new Date(value.created_at),
      updated_at: new Date(value.updated_at),
    };
  }
}
