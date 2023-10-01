import { TicketStatus } from '@prisma/client';
import { hotelsRepository } from '@/repositories';
import { ticketsService } from '@/services';
import { notFoundError, paymentRequired } from '@/errors';

async function isValid(userId: number) {
  const ticket = await ticketsService.getTicket(userId);
  const ticketType = await ticketsService.getTypeTicketByTicket(ticket);
  const booking = await hotelsRepository.getBookings(userId);

  if (booking.length === 0) throw notFoundError();

  if (ticket.status === TicketStatus.RESERVED || ticketType.isRemote || !ticketType.includesHotel)
    throw paymentRequired();
}

async function getHotels(userId: number) {
  await isValid(userId);
  return await hotelsRepository.getHotels();
}

async function getRoomsByHotel(hotelId: number, userId: number) {
  await isValid(userId);
  return await hotelsRepository.getRoomsByHotel(hotelId);
}

export const hotelsService = {
  getHotels,
  getRoomsByHotel,
};
