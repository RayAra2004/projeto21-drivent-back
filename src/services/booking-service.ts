import { TicketStatus } from '.prisma/client';
import { hotelsService } from './hotels-service';
import { ticketsService } from './tickets-service';
import { bookingRepository } from '@/repositories';
import { badRequest, forbiddenError, notFoundError } from '@/errors';

async function getBooking(userId: number) {
  const booking = await bookingRepository.getBooking(userId);

  if (!booking) throw notFoundError();

  return booking;
}

async function isValidCreate(userId: number, roomId: number) {
  const ticket = await ticketsService.getTicket(userId);
  const ticketType = await ticketsService.getTypeTicketByTicket(ticket);

  if (ticket.status === TicketStatus.RESERVED || ticketType.isRemote || !ticketType.includesHotel)
    throw forbiddenError();

  if (!roomId) throw badRequest('roomId is required!');

  const room = await hotelsService.getRoomById(roomId);
  if (!room) throw notFoundError();

  const availableVacancies = Number(room.capacity) - Number(await bookingRepository.countBookingsInRoom(roomId));

  if (availableVacancies <= 0) throw forbiddenError('Number of vacancies exceeded.');
}

async function createBooking(userId: number, roomId: number): Promise<number> {
  await isValidCreate(userId, roomId);

  const bookingId = await bookingRepository.createBooking(userId, roomId);

  return bookingId;
}

async function isValidUpdate(userId: number, roomId: number, bookingId: number) {
  if (isNaN(Number(bookingId)) || Number(bookingId) <= 0) throw badRequest('hotelId is invalid!!');

  const booking = await bookingRepository.getBooking(userId);

  if (!booking) throw forbiddenError();

  if (!roomId) throw badRequest('roomId is required!');

  const room = await hotelsService.getRoomById(roomId);
  if (!room) throw notFoundError();

  const availableVacancies = Number(room.capacity) - Number(await bookingRepository.countBookingsInRoom(roomId));

  if (availableVacancies <= 0) throw forbiddenError();
}

async function updateBooking(userId: number, roomId: number, bookingId: number): Promise<number> {
  await isValidUpdate(userId, roomId, bookingId);

  const response = await bookingRepository.updateBooking(userId, roomId, bookingId);

  return response;
}

export const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
  isValidCreate,
  isValidUpdate,
};
