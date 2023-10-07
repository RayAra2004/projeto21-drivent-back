import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services';

export async function getBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { userId } = req;

  const booking = await bookingService.getBooking(userId);
  res.send(booking);
}

export async function createBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { userId } = req;
  const { roomId } = req.body;

  const bookingId = await bookingService.createBooking(userId, roomId);

  res.send(bookingId);
}

export async function updateBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;

  const response = await bookingService.updateBooking(userId, roomId, Number(bookingId));

  res.send(response);
}
