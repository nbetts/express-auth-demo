import { getUserDetails } from "../../../../src/api/requestHandlers";
import { createRequest, createResponse } from 'node-mocks-http';
import * as db from "../../../../src/data/database";

describe('getUserDetails', () => {
  it('returns a 200 when the request is valid', () => {
    const request = createRequest();
    const response = createResponse({
      locals: {
        userId: 'user-id',
      },
    });
    const nextMock = jest.fn();

    const dbReadUserMock = jest.spyOn(db, 'readUser').mockReturnValueOnce({
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'mock-password-hash',
      passwordSalt: 'mock-password-salt',
      name: 'name',
    });

    getUserDetails(request, response, nextMock);

    expect(response.statusCode).toEqual(200);
    expect(response._getJSONData()).toEqual({
      id: 'user-id',
      email: 'test@example.com',
      name: 'name',
    });
    expect(nextMock).not.toHaveBeenCalled();
    expect(dbReadUserMock).toHaveBeenCalledWith('user-id');
  });

  it('returns a 404 when the user with ID does not exist', () => {
    const request = createRequest();
    const response = createResponse();
    const nextMock = jest.fn();

    jest.spyOn(db, 'readUser').mockImplementationOnce(() => {
      throw new Error('User not found');
    });

    getUserDetails(request, response, nextMock);

    expect(response.statusCode).toEqual(404);
    expect(response._getJSONData()).toEqual({
      error: 'User not found',
    });
    expect(nextMock).not.toHaveBeenCalled();
  });
});
