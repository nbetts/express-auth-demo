import { updateUserDetails } from "../../../../src/api/requestHandlers";
import { createRequest, createResponse } from 'node-mocks-http';
import * as db from "../../../../src/data/database";

describe('updateUserDetails', () => {
  it('returns a 200 when the request is valid and trims the name property', () => {
    const request = createRequest({
      body: {
        name: ' updated-name ',
      },
    });
    const response = createResponse({
      locals: {
        userId: 'user-id',
      },
    });
    const nextMock = jest.fn();

    const dbUpdateUserMock = jest.spyOn(db, 'updateUser').mockReturnValueOnce();

    updateUserDetails(request, response, nextMock);

    expect(response.statusCode).toEqual(200);
    expect(nextMock).not.toHaveBeenCalled();
    expect(dbUpdateUserMock).toHaveBeenCalledWith('user-id', {
      name: 'updated-name',
    });
  });

  it('returns a 404 when the user with ID does not exist', () => {
    const request = createRequest({
      body: {
        name: ' updated-name ',
      },
    });
    const response = createResponse({
      locals: {
        userId: 'user-id',
      },
    });
    const nextMock = jest.fn();

    jest.spyOn(db, 'readUser').mockImplementationOnce(() => {
      throw new Error('User not found');
    });

    updateUserDetails(request, response, nextMock);

    expect(response.statusCode).toEqual(404);
    expect(response._getJSONData()).toEqual({
      error: 'User not found',
    });
    expect(nextMock).not.toHaveBeenCalled();
  });
});
