import { faker } from '@faker-js/faker';
import { Booking, Hotel, Room, User } from '@prisma/client';
import { createUser } from './users-factory';
import { prisma } from '@/config';

export async function createHotel(): Promise<Hotel> {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoom(): Promise<{ room: Room; hotel: Hotel }> {
  const hotel = await createHotel();
  const room = await prisma.room.create({
    data: {
      name: faker.hacker.noun(),
      capacity: faker.datatype.number({ min: 1, max: 5 }),
      hotelId: hotel.id,
    },
  });
  return { room, hotel };
}

export async function createBooking(userInput?: User): Promise<{ booking: Booking; hotel: Hotel }> {
  const { room, hotel } = await createRoom();
  const user = userInput || (await createUser());
  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      roomId: room.id,
    },
  });
  return { booking, hotel };
}
