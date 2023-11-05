import request from 'supertest';
import { app } from '../../src/api/app';
import * as db from '../../src/data/database';
import { Database } from '../../src/data/types';

describe('register', () => {
  let mockDb: Database;

  beforeEach(() => {
    mockDb = {
      sessions: {},
      users: {},
    };
    db.createDatabase(mockDb);
  });

  it('returns 200 when the request is valid, and trims the name', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: 'Password123!',
      name: ' Nathan ',
    });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    expect(Object.keys(mockDb.sessions)).toHaveLength(1);
    expect(Object.keys(mockDb.users)).toHaveLength(1);
    expect(Object.values(mockDb.users)[0].name).toEqual('Nathan');
  });

  it('returns 400 when the email field is empty', async () => {
    const response = await request(app).post('/user').send({
      email: '',
      password: 'Password123!',
      name: 'Nathan',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        email: 'Must be a valid email address',
      },
    });
  });

  it('returns 400 when the email field is invalid', async () => {
    const response = await request(app).post('/user').send({
      email: 'asdf',
      password: 'Password123!',
      name: 'Nathan',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        email: 'Must be a valid email address',
      },
    });
  });

  it('returns 400 when the password field is empty', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: '',
      name: 'Nathan',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the password field is too short', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: 'A',
      name: 'Nathan',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the password field is too long', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFG',
      name: 'Nathan',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the password field is does not contain an uppercase letter', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: 'password123!',
      name: 'Nathan',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the password field is does not contain a lowercase letter', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: 'PASSWORD123!',
      name: 'Nathan',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the password field is does not contain a number', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: 'Password!',
      name: 'Nathan',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the password field is does not contain a symbol', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: 'Password123',
      name: 'Nathan',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        password: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the name field is empty', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: 'Password123!',
      name: '',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        name: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the name field is too short', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: 'Password123!',
      name: 'A',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        name: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the name field is too long', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: 'Password123!',
      name: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFG',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        name: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the name field contains characters that are not letters or spaces', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Nathan1',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        name: 'Must only contain letters and spaces',
      },
    });
  });

  it('returns 400 when the name field contains characters that only spaces', async () => {
    const response = await request(app).post('/user').send({
      email: 'test@example.com',
      password: 'Password123!',
      name: '  ',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        name: 'Must be 2-32 characters long',
      },
    });
  });
});
