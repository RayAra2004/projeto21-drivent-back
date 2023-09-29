import { Ticket, TicketType } from '@prisma/client';
import { badRequest, notFoundError } from '@/errors';
import { CreateTicket, ticketsRepository } from '@/repositories';
import { enrollmentsService } from '@/services';

async function getTypesTickets(): Promise<TicketType[]> {
  const typeTickets = await ticketsRepository.getTypesTickets();
  return typeTickets;
}

async function getTicket(id: number): Promise<Ticket> {
  const enrollmentId = await enrollmentsService.getEnrollment(id);

  const ticket = await ticketsRepository.getTicket(enrollmentId);

  if (!ticket) throw notFoundError();

  return ticket;
}

async function getTicketByUser(ticketId: number, userId: number): Promise<Ticket> {
  const enrollmentId = await enrollmentsService.getEnrollment(userId);

  return ticketsRepository.getTicketByUser(ticketId, enrollmentId);
}

async function createTicket(userId: number, ticketTypeId: number): Promise<CreateTicket> {
  if (ticketTypeId === null || ticketTypeId === undefined) throw badRequest('TicketTypeId is required!');
  const enrollmentId = await enrollmentsService.getEnrollment(userId);
  return await ticketsRepository.createTicket(ticketTypeId, enrollmentId);
}

export const ticketsService = {
  getTypesTickets,
  getTicket,
  createTicket,
  getTicketByUser,
};
