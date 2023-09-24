import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createTicket, getTicket, getTypesTickets } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getTypesTickets).get('/', getTicket).post('/', createTicket);

export { ticketsRouter };
