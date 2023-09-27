import { Ticket, TicketType } from '@prisma/client';
import { enrollmentsService } from './enrollments-service';
import { notFoundError } from '@/errors';
import { CreateTicket, ticketRepository } from '@/repositories/ticket-repository';
import { badRequest } from '@/errors/bad-request-error';

async function getTypesTickets(): Promise<TicketType[]> {
  const typeTickets = await ticketRepository.getTypesTickets();
  return typeTickets;
}

async function getTicket(id: number): Promise<Ticket> {
  const enrollmentId = await enrollmentsService.getEnrollment(id);

  const ticket = await ticketRepository.getTicket(enrollmentId);

  if (!ticket) throw notFoundError();

  return ticket;
}

async function getTicketByUser(ticketId: number, userId: number): Promise<Ticket> {
  const enrollmentId = await enrollmentsService.getEnrollment(userId);

  return ticketRepository.getTicketByUser(ticketId, enrollmentId);
}

async function createTicket(userId: number, ticketTypeId: number): Promise<CreateTicket> {
  if (ticketTypeId === null || ticketTypeId === undefined) throw badRequest('TicketTypeId is required!');
  const enrollmentId = await enrollmentsService.getEnrollment(userId);
  return await ticketRepository.createTicket(ticketTypeId, enrollmentId);
}

export const ticketsService = {
  getTypesTickets,
  getTicket,
  createTicket,
  getTicketByUser,
};
