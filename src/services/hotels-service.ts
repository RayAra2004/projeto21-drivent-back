import { TicketStatus } from '@prisma/client';
import { hotelsRepository } from '@/repositories';
import { ticketsService } from '@/services';
import { notFoundError, paymentRequired } from '@/errors';

async function isValid(userId: number) {
  const ticket = await ticketsService.getTicket(userId);
  const ticketType = await ticketsService.getTypeTicketByTicket(ticket);

  if (ticket.status === TicketStatus.RESERVED || ticketType.isRemote || !ticketType.includesHotel)
    throw paymentRequired();

  const hotels = await hotelsRepository.getHotels();

  if (hotels.length === 0) throw notFoundError();
}

async function getHotels(userId: number) {
  await isValid(userId);
  return await hotelsRepository.getHotels();
}

async function getRoomsByHotel(hotelId: number, userId: number) {
  await isValid(userId);
  return await hotelsRepository.getRoomsByHotel(hotelId);
}

async function getRoomById(roomId: number) {
  return await hotelsRepository.getRoomById(roomId);
}

export const hotelsService = {
  getHotels,
  getRoomsByHotel,
  getRoomById,
};
