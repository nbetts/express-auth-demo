import { authenticateRefresh } from "../../../../src/api/requestHandlers";
import { createRequest, createResponse } from 'node-mocks-http';
import crypto from 'crypto';
import * as authUtilities from "../../../../src/utilities/auth";
import * as db from "../../../../src/data/database";

describe('authenticateRefresh', () => {
  it('returns a 200 when the request is valid', () => {
    const request = createRequest({
      body: {
        refreshToken: 'refresh-token',
      },
    });
    const response = createResponse();
    const nextMock = jest.fn();

    jest.spyOn(authUtilities, 'verifyJWT').mockReturnValueOnce('user-id');
    jest.spyOn(authUtilities, 'hash').mockReturnValueOnce('mock-refresh-token-hash');

    jest.spyOn(db, 'readSessionByRefreshTokenHash').mockReturnValueOnce({
      id: 'session-id',
      userId: 'user-id',
      refreshTokenHash: 'refresh-token-hash',
      active: true,
    });
    const dbDeleteAllSessionsByUserIdMock = jest.spyOn(db, 'deleteAllSessionsByUserId').mockReturnValueOnce();

    authenticateRefresh(request, response, nextMock);

    expect(response.statusCode).toEqual(200);
    expect(response.locals.sessionId).toEqual('session-id');
    expect(response.locals.userId).toEqual('user-id');
    expect(nextMock).toHaveBeenCalled();
    expect(dbDeleteAllSessionsByUserIdMock).not.toHaveBeenCalled();
  });

  it('returns a 401 when the request is invalid', () => {
    const request = createRequest({
      body: {
        refreshToken: 'refresh-token',
      },
    });
    const response = createResponse();
    const nextMock = jest.fn();

    jest.spyOn(authUtilities, 'verifyJWT').mockReturnValueOnce('user-id');
    jest.spyOn(authUtilities, 'hash').mockReturnValueOnce('mock-refresh-token-hash');

    jest.spyOn(db, 'readSessionByRefreshTokenHash').mockReturnValueOnce({
      id: 'session-id',
      userId: 'user-id',
      refreshTokenHash: 'refresh-token-hash',
      active: false,
    });
    const dbDeleteAllSessionsByUserIdMock = jest.spyOn(db, 'deleteAllSessionsByUserId').mockReturnValueOnce();

    authenticateRefresh(request, response, nextMock);

    expect(response.statusCode).toEqual(401);
    expect(response.locals.sessionId).toBeUndefined();
    expect(response.locals.userId).toBeUndefined();
    expect(response._getJSONData()).toEqual({
      error: 'Unauthorized',
    });
    expect(nextMock).not.toHaveBeenCalled();
    expect(dbDeleteAllSessionsByUserIdMock).toHaveBeenCalledWith('user-id');
  });
});
