import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

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

async function getRoomById(roomId: number) {
  return await prisma.room.findUnique({
    where: { id: roomId },
  });
}

export const hotelsRepository = {
  getHotels,
  getRoomsByHotel,
  getRoomById,
};
