import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getRoomsByHotel } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getRoomsByHotel);

export { hotelsRouter };
