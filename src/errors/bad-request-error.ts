import { ApplicationError } from '@/protocols';

export function badRequest(message = 'Bad request'): ApplicationError {
  return {
    message: message,
    name: 'BadRequest',
  };
}
