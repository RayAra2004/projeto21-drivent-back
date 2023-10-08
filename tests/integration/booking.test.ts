import faker from '@faker-js/faker';
import supertest from 'supertest';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '.prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createBooking,
  createEnrollmentWithAddress,
  createRoom,
  createTicket,
  createTicketType,
  createUser,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking/');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 when the token is invalid', async () => {
    const token = faker.lorem.word();

    const { status } = await server.get('/booking/').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking/').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('return status 404 when user not have reserve', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createRoom();
      const response = await server.get('/booking/').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('return status 200 and body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const { room } = await createRoom();
      await createBooking(user.id, room.id);

      const { status, body } = await server.get('/booking/').set('Authorization', `Bearer ${token}`);

      expect(status).toEqual(httpStatus.OK);
      expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          Room: {
            id: expect.any(Number),
            name: expect.any(String),
            capacity: expect.any(Number),
            hotelId: expect.any(Number),
            createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
            updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
          },
        }),
      );
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking/');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 when the token is invalid', async () => {
    const token = faker.lorem.word();

    const { status } = await server.get('/booking/').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking/').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('return status 404 when roomId not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const { status } = await server
        .post('/booking/')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: faker.datatype.number({ max: 10 }) });

      expect(status).toBe(httpStatus.NOT_FOUND);
    });

    it('return status 200 and body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const { room } = await createRoom();

      const { status, body } = await server
        .post('/booking/')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id });

      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking/');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 when the token is invalid', async () => {
    const token = faker.lorem.word();

    const { status } = await server.get('/booking/').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking/').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('return status 200 and body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const { room } = await createRoom();

      const booking = await createBooking(user.id, room.id);

      const { room: newRomm } = await createRoom();
      const { status, body } = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: newRomm.id });

      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});
