import { ApplicationError } from '@/protocols';

export function forbiddenError(message = 'Request not accepted!'): ApplicationError {
  return {
    name: 'Forbidden',
    message,
  };
}
