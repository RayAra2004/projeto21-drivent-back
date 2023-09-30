import { ApplicationError } from '@/protocols';

export function paymentRequired(): ApplicationError {
  return {
    message: 'Payment is required',
    name: 'PaymentRequired',
  };
}
