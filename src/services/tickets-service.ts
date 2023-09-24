import { Ticket, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import { ticketRepository } from '@/repositories/ticket-repository';

async function getTypesTickets(): Promise<TicketType[]> {
  const typeTickets = await ticketRepository.getTypesTickets();
  return typeTickets;
}

async function getTicket(id: number): Promise<Ticket> {
  const ticket = await ticketRepository.getTicket(id);
  if (!ticket) throw notFoundError();

  return ticket;
}

/*async function createTicket(userId: number, ticketTypeId: number) {
  return true;
}*/

export const ticketsService = {
  getTypesTickets,
  getTicket,
};
