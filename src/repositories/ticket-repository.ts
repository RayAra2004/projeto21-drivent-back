import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function getTypesTickets(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

async function getTicket(id: number): Promise<Ticket> {
  return await prisma.ticket.findUnique({
    where: { enrollmentId: id },
    include: { TicketType: true },
  });
}

export const ticketRepository = {
  getTypesTickets,
  getTicket,
};
