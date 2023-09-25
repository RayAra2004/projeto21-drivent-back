import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services/tickets-service';

export async function getTypesTickets(req: AuthenticatedRequest, res: Response): Promise<void> {
  const typeTickets = await ticketsService.getTypesTickets();

  res.status(httpStatus.OK).send(typeTickets);
}

export async function getTicket(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { userId } = req;

  const ticket = await ticketsService.getTicket(userId);

  res.status(httpStatus.OK).send(ticket);
}

export async function createTicket(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { ticketTypeId } = req.body;
  const { userId } = req;

  const ticket = await ticketsService.createTicket(userId, ticketTypeId);

  res.status(httpStatus.CREATED).send(ticket);
}
