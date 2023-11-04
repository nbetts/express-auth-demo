import { createSession } from "../../../../src/api/requestHandlers";
import { createRequest, createResponse } from 'node-mocks-http';
import crypto from 'crypto';
import * as authUtilities from "../../../../src/utilities/auth";
import * as db from "../../../../src/data/database";

describe('createSession', () => {
  it('returns a 200 when the request is valid', () => {
    const request = createRequest();
    const response = createResponse({
      locals: {
        userId: 'user-id',
      },
    });
    const nextMock = jest.fn();

    jest.spyOn(authUtilities, 'createJWT')
      .mockReturnValueOnce('mock-access-token')
      .mockReturnValueOnce('mock-refresh-token');
    jest.spyOn(authUtilities, 'hash').mockReturnValueOnce('mock-refresh-token-hash');
    jest.spyOn(crypto, 'randomUUID').mockReturnValueOnce('1-2-3-4-5');

    const dbDeleteAllSessionsByUserIdMock = jest.spyOn(db, 'deleteAllSessionsByUserId').mockReturnValueOnce();
    const dbCreateSessionMock = jest.spyOn(db, 'createSession').mockReturnValueOnce();

    createSession(request, response, nextMock);

    expect(response.statusCode).toEqual(200);
    expect(response._getJSONData()).toEqual({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });
    expect(nextMock).not.toHaveBeenCalled();
    expect(dbDeleteAllSessionsByUserIdMock).not.toHaveBeenCalled();
    expect(dbCreateSessionMock).toHaveBeenCalledWith({
      id: '1-2-3-4-5',
      userId: 'user-id',
      refreshTokenHash: 'mock-refresh-token-hash',
      active: true,
    });
  });

  it('returns a 200 when the request is valid and deletes all sessions for the given user ID when the deleteExistingSessions property is true', () => {
    const request = createRequest();
    const response = createResponse({
      locals: {
        userId: 'user-id',
        deleteExistingSessions: true,
      },
    });
    const nextMock = jest.fn();

    jest.spyOn(authUtilities, 'createJWT')
      .mockReturnValueOnce('mock-access-token')
      .mockReturnValueOnce('mock-refresh-token');
    jest.spyOn(authUtilities, 'hash').mockReturnValueOnce('mock-refresh-token-hash');
    jest.spyOn(crypto, 'randomUUID').mockReturnValueOnce('1-2-3-4-5');

    const dbDeleteAllSessionsByUserIdMock = jest.spyOn(db, 'deleteAllSessionsByUserId').mockReturnValueOnce();
    const dbCreateSessionMock = jest.spyOn(db, 'createSession').mockReturnValueOnce();

    createSession(request, response, nextMock);

    expect(response.statusCode).toEqual(200);
    expect(response._getJSONData()).toEqual({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });
    expect(nextMock).not.toHaveBeenCalled();
    expect(dbDeleteAllSessionsByUserIdMock).toHaveBeenCalledWith('user-id');
    expect(dbCreateSessionMock).toHaveBeenCalledWith({
      id: '1-2-3-4-5',
      userId: 'user-id',
      refreshTokenHash: 'mock-refresh-token-hash',
      active: true,
    });
  });

  it('throws an error when the userId property is missing', () => {
    const request = createRequest();
    const response = createResponse();
    const nextMock = jest.fn();

    expect(() => createSession(request, response, nextMock)).toThrow('Missing userId');
    expect(nextMock).not.toHaveBeenCalled();
  });
});
