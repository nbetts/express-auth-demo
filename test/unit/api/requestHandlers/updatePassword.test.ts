import { updatePassword } from "../../../../src/api/requestHandlers";
import { createRequest, createResponse } from 'node-mocks-http';
import crypto from 'crypto';
import * as authUtilities from "../../../../src/utilities/auth";
import * as db from "../../../../src/data/database";

describe('updatePassword', () => {
  it('returns a 200 when the request is valid', () => {
    const request = createRequest({
      body: {
        currentPassword: 'current-password',
        newPassword: 'new-password',
      },
    });
    const response = createResponse({
      locals: {
        userId: 'user-id',
      },
    });
    const nextMock = jest.fn();

    jest.spyOn(authUtilities, 'hash')
      .mockReturnValueOnce('mock-password-hash')
      .mockReturnValueOnce('mock-new-password-hash');
    jest.spyOn(crypto, 'randomUUID').mockReturnValueOnce('1-2-3-4-5');

    const dbReadUserMock = jest.spyOn(db, 'readUser').mockReturnValueOnce({
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'mock-password-hash',
      passwordSalt: 'mock-password-salt',
      name: 'name',
    });

    const dbUpdateUserMock = jest.spyOn(db, 'updateUser').mockReturnValueOnce();

    updatePassword(request, response, nextMock);

    expect(response.statusCode).toEqual(200);
    expect(response.locals.deleteExistingSessions).toEqual(true);
    expect(nextMock).toHaveBeenCalled();
    expect(dbReadUserMock).toHaveBeenCalledWith('user-id');
    expect(dbUpdateUserMock).toHaveBeenCalledWith('user-id', {
      passwordHash: 'mock-new-password-hash',
      passwordSalt: '1-2-3-4-5',
    });
  });

  it('returns a 401 when the current password is incorrect', () => {
    const request = createRequest({
      body: {
        currentPassword: 'current-password',
        newPassword: 'new-password',
      },
    });
    const response = createResponse({
      locals: {
        userId: 'user-id',
      },
    });
    const nextMock = jest.fn();

    jest.spyOn(authUtilities, 'hash').mockReturnValueOnce('mock-different-password-hash');

    const dbReadUserMock = jest.spyOn(db, 'readUser').mockReturnValueOnce({
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'mock-password-hash',
      passwordSalt: 'mock-password-salt',
      name: 'name',
    });

    updatePassword(request, response, nextMock);

    expect(response.statusCode).toEqual(401);
    expect(response.locals.deleteExistingSessions).toBeUndefined();
    expect(nextMock).not.toHaveBeenCalled();
    expect(dbReadUserMock).toHaveBeenCalledWith('user-id');
  });
});
