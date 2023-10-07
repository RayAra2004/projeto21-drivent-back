import { prisma } from '@/config';

export type getBooking = {
  id: number;
  Room: {
    id: number;
    name: string;
    capacity: number;
    hotelId: number;
    createdAt: Date;
    updatedAt: Date;
  };
};

async function countBookingsInRoom(roomId: number) {
  const bookingsCount = await prisma.booking.count({
    where: {
      roomId: roomId,
    },
  });

  return bookingsCount;
}

async function getBooking(userId: number): Promise<getBooking> {
  return await prisma.booking.findUnique({
    where: { userId },
    select: {
      id: true,
      Room: {
        select: {
          id: true,
          name: true,
          capacity: true,
          hotelId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}

async function createBooking(userId: number, roomId: number): Promise<number> {
  const reserve = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });

  return reserve.id;
}

async function updateBooking(userId: number, roomId: number, bookingId: number): Promise<number> {
  await prisma.booking.delete({
    where: { id: bookingId },
  });

  return await createBooking(userId, roomId);
}

export const bookingRepository = {
  getBooking,
  createBooking,
  updateBooking,
  countBookingsInRoom,
};
