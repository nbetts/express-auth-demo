import { register } from "../../../../src/api/requestHandlers";
import { createRequest, createResponse } from 'node-mocks-http';
import crypto from 'crypto';
import * as authUtilities from "../../../../src/utilities/auth";
import * as db from "../../../../src/data/database";

describe('register', () => {
  it('returns a 201 when the request is valid and trims the name property', () => {
    const request = createRequest({
      body: {
        email: 'test@example.com',
        password: 'password',
        name: ' name ',
      },
    });
    const response = createResponse();
    const nextMock = jest.fn();

    jest.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('1-2-3-4-5')
      .mockReturnValueOnce('6-7-8-9-0');
    jest.spyOn(authUtilities, 'hash').mockReturnValueOnce('mock-password-hash');

    jest.spyOn(db, 'queryUsersByEmail').mockReturnValueOnce([]);
    const dbCreateUserMock = jest.spyOn(db, 'createUser').mockReturnValueOnce();

    register(request, response, nextMock);

    expect(response.statusCode).toEqual(201);
    expect(response.locals.userId).toEqual('1-2-3-4-5');
    expect(nextMock).toHaveBeenCalled();
    expect(dbCreateUserMock).toHaveBeenCalledWith({
      id: '1-2-3-4-5',
      email: 'test@example.com',
      passwordHash: 'mock-password-hash',
      passwordSalt: '6-7-8-9-0',
      name: 'name',
    });
  });

  it('returns a 409 when the user already exists', () => {
    const request = createRequest({
      body: {
        email: 'test@example.com',
        password: 'password',
      },
    });
    const response = createResponse();
    const nextMock = jest.fn();

    jest.spyOn(authUtilities, 'hash').mockReturnValueOnce('mock-password-hash');

    jest.spyOn(db, 'queryUsersByEmail').mockReturnValueOnce([{
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'incorrect-mock-password-hash',
      passwordSalt: 'mock-password-salt',
      name: 'name',
    }]);

    register(request, response, nextMock);

    expect(response.statusCode).toEqual(409);
    expect(response._getJSONData()).toEqual({
      error: 'User with email already exists',
    });
    expect(nextMock).not.toHaveBeenCalled();
  });
});
