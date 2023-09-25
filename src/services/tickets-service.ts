import { Ticket, TicketType } from '@prisma/client';
import { enrollmentsService } from './enrollments-service';
import { notFoundError } from '@/errors';
import { ticketRepository } from '@/repositories/ticket-repository';
import { badRequest } from '@/errors/bad-request-error';

async function getTypesTickets(): Promise<TicketType[]> {
  const typeTickets = await ticketRepository.getTypesTickets();
  return typeTickets;
}

async function getTicket(id: number): Promise<Ticket> {
  const ticket = await ticketRepository.getTicket(id);
  if (ticket === null || ticket === undefined) throw notFoundError();

  return ticket;
}

async function createTicket(userId: number, ticketTypeId: number) {
  if (ticketTypeId === null || ticketTypeId === undefined) throw badRequest('TicketTypeId is required!');
  const enrollmentId = await enrollmentsService.getEnrollment(userId);
  return await ticketRepository.createTicket(ticketTypeId, enrollmentId);
}

export const ticketsService = {
  getTypesTickets,
  getTicket,
  createTicket,
};
