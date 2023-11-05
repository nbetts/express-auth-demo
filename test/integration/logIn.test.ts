import request from 'supertest';
import { app } from '../../src/api/app';
import * as db from '../../src/data/database';
import { Database } from '../../src/data/types';

describe('logIn', () => {
  let mockDb: Database;

  beforeEach(() => {
    mockDb = {
      sessions: {},
      users: {
        'user-id': {
          id: 'user-id',
          email: 'test@example.com',
          passwordHash: '0a41c0f4b4e2f603e5fef31175c59b3646ba2dab9c1f451f863ea0ce96792bb5',
          passwordSalt: '649b9933-ea50-4b97-a1b8-025c92506134',
          name: 'Nathan',
        },
      },
    };
    db.createDatabase(mockDb);
  });

  it('returns 200 when the request is valid', async () => {
    const response = await request(app).post('/session').send({
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    expect(Object.keys(mockDb.sessions)).toHaveLength(1);
  });

  it('returns a 401 when the user with email does not exist', async () => {
    const response = await request(app).post('/session').send({
      email: 'missing@example.com',
      password: 'Password123!',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      error: 'Incorrect email or password',
    });
    expect(Object.keys(mockDb.sessions)).toHaveLength(0);
  });

  it('returns a 401 when the password is incorrect', async () => {
    const response = await request(app).post('/session').send({
      email: 'test@example.com',
      password: 'IncorrectPassword123!',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      error: 'Incorrect email or password',
    });
    expect(Object.keys(mockDb.sessions)).toHaveLength(0);
  });

  it('returns 400 when the email field is empty', async () => {
    const response = await request(app).post('/session').send({
      email: '',
      password: 'Password123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        email: 'Must be a valid email address',
      },
    });
  });

  it('returns 400 when the email field is invalid', async () => {
    const response = await request(app).post('/session').send({
      email: 'asdf',
      password: 'Password123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        email: 'Must be a valid email address',
      },
    });
  });

  it('returns 400 when the password field is empty', async () => {
    const response = await request(app).post('/session').send({
      email: 'test@example.com',
      password: '',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the password field is too short', async () => {
    const response = await request(app).post('/session').send({
      email: 'test@example.com',
      password: 'A',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the password field is too long', async () => {
    const response = await request(app).post('/session').send({
      email: 'test@example.com',
      password: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFG',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the password field is does not contain an uppercase letter', async () => {
    const response = await request(app).post('/session').send({
      email: 'test@example.com',
      password: 'password123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the password field is does not contain a lowercase letter', async () => {
    const response = await request(app).post('/session').send({
      email: 'test@example.com',
      password: 'PASSWORD123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the password field is does not contain a number', async () => {
    const response = await request(app).post('/session').send({
      email: 'test@example.com',
      password: 'Password!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the password field is does not contain a symbol', async () => {
    const response = await request(app).post('/session').send({
      email: 'test@example.com',
      password: 'Password123',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });
});
