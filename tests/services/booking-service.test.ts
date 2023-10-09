import { faker } from '@faker-js/faker';
import { TicketStatus } from '.prisma/client';
import { bookingService } from './../../src/services/booking-service';
import { bookingRepository, enrollmentRepository, hotelsRepository, ticketsRepository } from '@/repositories';

describe('function isValidCreate', () => {
  it('should status 403 when the room is crowded', async () => {
    jest.spyOn(ticketsRepository, 'getTicket').mockResolvedValueOnce({
      id: faker.datatype.number(),
      ticketTypeId: faker.datatype.number(),
      enrollmentId: faker.datatype.number(),
      status: TicketStatus.PAID,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(enrollmentRepository, 'get').mockResolvedValueOnce({
      id: faker.datatype.number(),
      cpf: faker.commerce.department(),
      birthday: faker.datatype.datetime(),
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      userId: faker.datatype.number(),
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(ticketsRepository, 'getTypeTicketByTicket').mockResolvedValueOnce({
      id: faker.datatype.number(),
      name: faker.company.companyName(),
      price: faker.datatype.float(),
      isRemote: false,
      includesHotel: true,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(hotelsRepository, 'getRoomById').mockResolvedValueOnce({
      id: faker.datatype.number(),
      name: faker.company.companyName(),
      capacity: 3,
      hotelId: faker.datatype.number(),
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(bookingRepository, 'countBookingsInRoom').mockResolvedValueOnce(3);

    try {
      await bookingService.isValidCreate(faker.datatype.number(), faker.datatype.number());

      fail('Expected function to throw an exception');
    } catch (error) {
      expect(error).toEqual({
        message: 'Number of vacancies exceeded.',
        name: 'Forbidden',
      });
    }
  });

  it('should status 403 when ticket is remote', async () => {
    jest.spyOn(ticketsRepository, 'getTicket').mockResolvedValueOnce({
      id: faker.datatype.number(),
      ticketTypeId: faker.datatype.number(),
      enrollmentId: faker.datatype.number(),
      status: TicketStatus.RESERVED,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(enrollmentRepository, 'get').mockResolvedValueOnce({
      id: faker.datatype.number(),
      cpf: faker.commerce.department(),
      birthday: faker.datatype.datetime(),
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      userId: faker.datatype.number(),
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(ticketsRepository, 'getTypeTicketByTicket').mockResolvedValueOnce({
      id: faker.datatype.number(),
      name: faker.company.companyName(),
      price: faker.datatype.float(),
      isRemote: false,
      includesHotel: true,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    try {
      await bookingService.isValidCreate(faker.datatype.number(), faker.datatype.number());

      fail('Expected function to throw an exception');
    } catch (error) {
      expect(error).toEqual({
        message: 'Request not accepted!',
        name: 'Forbidden',
      });
    }
  });

  it('should status 403 when hotel not includes', async () => {
    jest.spyOn(ticketsRepository, 'getTicket').mockResolvedValueOnce({
      id: faker.datatype.number(),
      ticketTypeId: faker.datatype.number(),
      enrollmentId: faker.datatype.number(),
      status: TicketStatus.PAID,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(enrollmentRepository, 'get').mockResolvedValueOnce({
      id: faker.datatype.number(),
      cpf: faker.commerce.department(),
      birthday: faker.datatype.datetime(),
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      userId: faker.datatype.number(),
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(ticketsRepository, 'getTypeTicketByTicket').mockResolvedValueOnce({
      id: faker.datatype.number(),
      name: faker.company.companyName(),
      price: faker.datatype.float(),
      isRemote: false,
      includesHotel: false,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    try {
      await bookingService.isValidCreate(faker.datatype.number(), faker.datatype.number());

      fail('Expected function to throw an exception');
    } catch (error) {
      expect(error).toEqual({
        message: 'Request not accepted!',
        name: 'Forbidden',
      });
    }
  });

  it('should status 403 when ticketStatus is RESERVED', async () => {
    jest.spyOn(ticketsRepository, 'getTicket').mockResolvedValueOnce({
      id: faker.datatype.number(),
      ticketTypeId: faker.datatype.number(),
      enrollmentId: faker.datatype.number(),
      status: TicketStatus.PAID,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(enrollmentRepository, 'get').mockResolvedValueOnce({
      id: faker.datatype.number(),
      cpf: faker.commerce.department(),
      birthday: faker.datatype.datetime(),
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      userId: faker.datatype.number(),
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(ticketsRepository, 'getTypeTicketByTicket').mockResolvedValueOnce({
      id: faker.datatype.number(),
      name: faker.company.companyName(),
      price: faker.datatype.float(),
      isRemote: true,
      includesHotel: true,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    try {
      await bookingService.isValidCreate(faker.datatype.number(), faker.datatype.number());

      fail('Expected function to throw an exception');
    } catch (error) {
      expect(error).toEqual({
        message: 'Request not accepted!',
        name: 'Forbidden',
      });
    }
  });

  it('should status 404 when the roomId not exist', async () => {
    jest.spyOn(ticketsRepository, 'getTicket').mockResolvedValueOnce({
      id: faker.datatype.number(),
      ticketTypeId: faker.datatype.number(),
      enrollmentId: faker.datatype.number(),
      status: TicketStatus.PAID,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(enrollmentRepository, 'get').mockResolvedValueOnce({
      id: faker.datatype.number(),
      cpf: faker.commerce.department(),
      birthday: faker.datatype.datetime(),
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      userId: faker.datatype.number(),
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(ticketsRepository, 'getTypeTicketByTicket').mockResolvedValueOnce({
      id: faker.datatype.number(),
      name: faker.company.companyName(),
      price: faker.datatype.float(),
      isRemote: false,
      includesHotel: true,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    });

    jest.spyOn(hotelsRepository, 'getRoomById').mockResolvedValueOnce(null);

    try {
      await bookingService.isValidCreate(faker.datatype.number(), faker.datatype.number());

      fail('Expected function to throw an exception');
    } catch (error) {
      expect(error).toEqual({
        message: 'No result for this search!',
        name: 'NotFoundError',
      });
    }
  });
});
