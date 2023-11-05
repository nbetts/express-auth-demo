import { logOut } from "../../../../src/api/requestHandlers";
import { createRequest, createResponse } from 'node-mocks-http';
import * as db from "../../../../src/data/database";

describe('logOut', () => {
  it('returns a 200 when the request is valid', () => {
    const request = createRequest();
    const response = createResponse({
      locals: {
        sessionId: 'session-id',
      },
    });
    const nextMock = jest.fn();

    const dbDeleteSessionMock = jest.spyOn(db, 'deleteSession').mockReturnValueOnce();

    logOut(request, response, nextMock);

    expect(response.statusCode).toEqual(200);
    expect(nextMock).not.toHaveBeenCalled();
    expect(dbDeleteSessionMock).toHaveBeenCalledWith('session-id');
  });
});
