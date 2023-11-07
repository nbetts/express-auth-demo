import request from 'supertest';
import { app } from '../../src/api/app';
import * as db from '../../src/data/database';
import { Database } from '../../src/data/types';
import { testAuthorizationHeader, testUser } from '../testData';
import { accessTokenExpiresInSeconds } from '../../src/api/requestHandlers';

describe('updateUser', () => {
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
    const response = await request(app).put('/user').set(testAuthorizationHeader).send({
      name: 'Updated name',
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
  });

  it('returns 401 when the access token has expired', async () => {
    jest.setSystemTime(accessTokenExpiresInSeconds * 1000);

    const response = await request(app).put('/user').set(testAuthorizationHeader).send({
      name: 'Updated name',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
    });
  });

  it('returns 400 when the name field is empty', async () => {
    const response = await request(app).put('/user').set(testAuthorizationHeader).send({
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
    const response = await request(app).put('/user').set(testAuthorizationHeader).send({
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
    const response = await request(app).put('/user').set(testAuthorizationHeader).send({
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
    const response = await request(app).put('/user').set(testAuthorizationHeader).send({
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
    const response = await request(app).put('/user').set(testAuthorizationHeader).send({
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
