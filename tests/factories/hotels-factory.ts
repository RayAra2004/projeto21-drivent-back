import { faker } from '@faker-js/faker';
import { Hotel, Room } from '@prisma/client';
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
