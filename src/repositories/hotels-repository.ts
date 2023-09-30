import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function getBookings(userId: number) {
  return await prisma.booking.findMany({
    where: { userId },
  });
}

async function getHotels(): Promise<Hotel[]> {
  return await prisma.hotel.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function getRoomsByHotel(hotelId: number) {
  return await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: { Rooms: true },
  });
}

export const hotelsRepository = {
  getHotels,
  getBookings,
  getRoomsByHotel,
};
