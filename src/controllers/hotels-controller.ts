import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';
import { badRequest } from '@/errors';

export async function getHotels(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { userId } = req;
  const hotels = await hotelsService.getHotels(userId);

  res.send(hotels);
}

export async function getRoomsByHotel(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { userId } = req;
  const { hotelId } = req.params;

  if (isNaN(Number(hotelId)) || Number(hotelId) <= 0) throw badRequest('hotelId is invalid!!');

  const hotels = await hotelsService.getRoomsByHotel(Number(hotelId), userId);

  res.send(hotels);
}
