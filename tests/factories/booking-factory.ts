import { faker } from '@faker-js/faker';
import { Booking } from '.prisma/client';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId?: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      userId,
      roomId: roomId === undefined ? faker.datatype.number({ max: 100 }) : roomId,
    },
  });
}
