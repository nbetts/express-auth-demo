import request from 'supertest';
import { app } from '../../src/api/app';
import * as db from '../../src/data/database';
import { Database } from '../../src/data/types';
import { testSession1, testRefreshToken, testAuthorizationHeader, testSession2 } from '../testData';
import { accessTokenExpiresInSeconds } from '../../src/api/requestHandlers';

describe('logOut', () => {
  let mockDb: Database;

  beforeEach(() => {
    jest.setSystemTime(0);

    mockDb = {
      sessions: {
        [testSession1.id]: testSession1,
      },
      users: {},
    };
    db.createDatabase(mockDb);
  });

  it('returns 200 when the request is valid', async () => {
    const response = await request(app).delete('/session').set(testAuthorizationHeader).send({
      refreshToken: testRefreshToken,
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
    expect(Object.keys(mockDb.sessions)).toHaveLength(0);
  });

  it('returns 401 when the access token has expired', async () => {
    jest.setSystemTime(accessTokenExpiresInSeconds * 1000);

    const response = await request(app).delete('/session').set(testAuthorizationHeader).send({
      refreshToken: testRefreshToken,
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
    });
    expect(Object.keys(mockDb.sessions)).toHaveLength(1);
  });

  it('returns 401 when the refresh token is compromised', async () => {
    mockDb = {
      sessions: {
        [testSession2.id]: testSession2,
        [testSession1.id]: testSession1,
      },
      users: {},
    };
    db.createDatabase(mockDb);

    const response = await request(app).delete('/session').set(testAuthorizationHeader).send({
      refreshToken: testRefreshToken,
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
    });
    expect(Object.keys(mockDb.sessions)).toHaveLength(0);
  });

  it('returns 400 when the refreshToken field is invalid', async () => {
    const response = await request(app).delete('/session').send({
      refreshToken: 'invalid-refresh-token',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: {
        refreshToken: 'Must be a valid JWT',
      },
    });
  });
});
