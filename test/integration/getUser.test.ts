import request from 'supertest';
import { app } from '../../src/api/app';
import * as db from '../../src/data/database';
import { Database } from '../../src/data/types';
import { testAuthorizationHeader, testUser } from '../testData';
import { accessTokenExpiresInSeconds } from '../../src/api/requestHandlers';

describe('getUser', () => {
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
    const response = await request(app).get('/user').set(testAuthorizationHeader).send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: testUser.id,
      email: testUser.email,
      name: testUser.name,
    });
  });

  it('returns 401 when the access token has expired', async () => {
    jest.setSystemTime(accessTokenExpiresInSeconds * 1000);

    const response = await request(app).get('/user').set(testAuthorizationHeader).send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
    });
  });
});
