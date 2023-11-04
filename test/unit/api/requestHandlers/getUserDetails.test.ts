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

    const dbReadUserMock = jest.spyOn(db, 'readUser').mockImplementation(() => ({
      id: 'user-id',
      email: 'user-email',
      passwordHash: 'user-password-hash',
      passwordSalt: 'user-password-salt',
      name: 'user-name',
    }));

    getUserDetails(request, response, nextMock);

    expect(response.statusCode).toEqual(200);
    expect(response._getJSONData()).toEqual({
      id: 'user-id',
      email: 'user-email',
      name: 'user-name',
    });
    expect(nextMock).not.toHaveBeenCalled();
    expect(dbReadUserMock).toHaveBeenCalledWith('user-id');
  });

  it('returns a 404 when the userId property is missing', () => {
    const request = createRequest();
    const response = createResponse();
    const nextMock = jest.fn();

    getUserDetails(request, response, nextMock);

    expect(response.statusCode).toEqual(404);
    expect(response._getJSONData()).toEqual({
      error: 'User not found',
    });
    expect(nextMock).not.toHaveBeenCalled();
  });
});
