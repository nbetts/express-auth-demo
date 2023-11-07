import request from 'supertest';
import { app } from '../../src/api/app';
import * as db from '../../src/data/database';
import { Database } from '../../src/data/types';
import { testAuthorizationHeader, testUser } from '../testData';
import { accessTokenExpiresInSeconds } from '../../src/api/requestHandlers';

describe('updatePassword', () => {
  let mockDb: Database;

  beforeEach(() => {
    jest.setSystemTime(0);

    mockDb = {
      sessions: {},
      users: {
        [testUser.id]: testUser,
      },
    };
    db.createDatabase(mockDb);
  });

  it('returns 200 when the request is valid', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'Password123!',
      newPassword: 'Password234!',
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    expect(Object.keys(mockDb.sessions)).toHaveLength(1);
  });

  it('returns 401 when the access token has expired', async () => {
    jest.setSystemTime(accessTokenExpiresInSeconds * 1000);

    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'Password123!',
      newPassword: 'Password234!',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
    });
  });

  it('returns 401 when the current password is incorrect', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'Password234!',
      newPassword: 'Password234!',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      error: 'Incorrect password',
    });
  });

  // 401 password incorrect

  it('returns 400 when the currentPassword field is empty', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: '',
      newPassword: 'Password123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        currentPassword: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the currentPassword field is too short', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'A',
      newPassword: 'Password123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        currentPassword: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the currentPassword field is too long', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFG',
      newPassword: 'Password123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        currentPassword: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the currentPassword field is does not contain an uppercase letter', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'password123!',
      newPassword: 'Password123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        currentPassword: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the currentPassword field is does not contain a lowercase letter', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'PASSWORD123!',
      newPassword: 'Password123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        currentPassword: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the currentPassword field is does not contain a number', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'Password!',
      newPassword: 'Password123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        currentPassword: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the currentPassword field is does not contain a symbol', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'Password123',
      newPassword: 'Password123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        currentPassword: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the newPassword field is empty', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'Password123!',
      newPassword: '',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        newPassword: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the newPassword field is too short', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'Password123!',
      newPassword: 'A',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        newPassword: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the newPassword field is too long', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'Password123!',
      newPassword: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFG',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        newPassword: 'Must be 2-32 characters long',
      },
    });
  });

  it('returns 400 when the newPassword field is does not contain an uppercase letter', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'Password123!',
      newPassword: 'password123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        newPassword: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the newPassword field is does not contain a lowercase letter', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'Password123!',
      newPassword: 'PASSWORD123!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        newPassword: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the newPassword field is does not contain a number', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'Password123!',
      newPassword: 'Password!',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        newPassword: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });

  it('returns 400 when the newPassword field is does not contain a symbol', async () => {
    const response = await request(app).put('/user/password').set(testAuthorizationHeader).send({
      currentPassword: 'Password123!',
      newPassword: 'Password123',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        newPassword: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
      },
    });
  });
});
