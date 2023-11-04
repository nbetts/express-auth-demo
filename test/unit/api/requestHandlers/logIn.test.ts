import { logIn } from "../../../../src/api/requestHandlers";
import { createRequest, createResponse } from 'node-mocks-http';
import * as authUtilities from "../../../../src/utilities/auth";
import * as db from "../../../../src/data/database";

describe('logIn', () => {
  it('returns a 200 when the request is valid', () => {
    const request = createRequest({
      body: {
        email: 'test@example.com',
        password: 'password',
      },
    });
    const response = createResponse();
    const nextMock = jest.fn();

    jest.spyOn(authUtilities, 'hash').mockReturnValueOnce('mock-password-hash');

    jest.spyOn(db, 'readUserByEmail').mockImplementation(() => ({
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'mock-password-hash',
      passwordSalt: 'mock-password-salt',
      name: 'name',
    }));

    logIn(request, response, nextMock);

    expect(response.statusCode).toEqual(200);
    expect(response.locals.userId).toEqual('user-id');
    expect(nextMock).toHaveBeenCalled();
  });

  it('returns a 401 when the user with email does not exist', () => {
    const request = createRequest({
      body: {
        email: 'test@example.com',
        password: 'password',
      },
    });
    const response = createResponse();
    const nextMock = jest.fn();

    const dbReadUserMock = jest.spyOn(db, 'readUserByEmail').mockImplementation(() => {
      throw new Error('User does not exist');
    });

    logIn(request, response, nextMock);

    expect(response.statusCode).toEqual(401);
    expect(response._getJSONData()).toEqual({
      error: 'Incorrect email or password',
    });
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('returns a 401 when the password is incorrect', () => {
    const request = createRequest({
      body: {
        email: 'test@example.com',
        password: 'password',
      },
    });
    const response = createResponse();
    const nextMock = jest.fn();

    jest.spyOn(authUtilities, 'hash').mockReturnValueOnce('mock-password-hash');

    jest.spyOn(db, 'readUserByEmail').mockImplementation(() => ({
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'incorrect-mock-password-hash',
      passwordSalt: 'mock-password-salt',
      name: 'name',
    }));

    logIn(request, response, nextMock);

    expect(response.statusCode).toEqual(401);
    expect(response._getJSONData()).toEqual({
      error: 'Incorrect email or password',
    });
    expect(nextMock).not.toHaveBeenCalled();
  });
});
