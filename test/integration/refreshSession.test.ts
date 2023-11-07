import request from 'supertest';
import { app } from '../../src/api/app';
import * as db from '../../src/data/database';
import { Database } from '../../src/data/types';
import { testSession1, testRefreshToken, testAuthorizationHeader, testSession2 } from '../testData';
import { accessTokenExpiresInSeconds, refreshTokenExpiresInSeconds } from '../../src/api/requestHandlers';

describe('refreshSession', () => {
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
    const response = await request(app).put('/session').send({
      refreshToken: testRefreshToken,
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    expect(Object.keys(mockDb.sessions)).toHaveLength(2);
  });

  it('returns 401 when the refresh token has expired', async () => {
    jest.setSystemTime(refreshTokenExpiresInSeconds * 1000);

    mockDb = {
      sessions: {
        [testSession2.id]: testSession2,
        [testSession1.id]: testSession1,
      },
      users: {},
    };
    db.createDatabase(mockDb);

    const response = await request(app).put('/session').send({
      refreshToken: testRefreshToken,
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
    });
    expect(Object.keys(mockDb.sessions)).toHaveLength(2);
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

    const response = await request(app).put('/session').send({
      refreshToken: testRefreshToken,
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
    });
    expect(Object.keys(mockDb.sessions)).toHaveLength(0);
  });

  it('returns 400 when the refreshToken field is invalid', async () => {
    const response = await request(app).put('/session').send({
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
