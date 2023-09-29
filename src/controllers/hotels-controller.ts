import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';

export async function getHotels(req: AuthenticatedRequest, res: Response): Promise<void> {
  res.send('ok');
}
