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

async function createTicket(ticketTypeId: number, enrollmentId: number): Promise<CreateTicket> {
  return await prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status: 'RESERVED',
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      createdAt: true,
      updatedAt: true,
      TicketType: {
        select: {
          id: true,
          name: true,
          price: true,
          isRemote: true,
          includesHotel: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}

async function getTicketByUser(ticketId: number, enrollmentId: number): Promise<Ticket> {
  return await prisma.ticket.findUnique({
    where: { id: ticketId, enrollmentId },
  });
}

export type CreateTicket = {
  id: number;
  status: string;
  ticketTypeId: number;
  enrollmentId: number;
  TicketType: {
    id: number;
    name: string;
    price: number;
    isRemote: boolean;
    includesHotel: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

export const ticketRepository = {
  getTypesTickets,
  getTicket,
  createTicket,
  getTicketByUser,
};
