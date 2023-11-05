import { refreshSession } from "../../../../src/api/requestHandlers";
import { createRequest, createResponse } from 'node-mocks-http';
import * as db from "../../../../src/data/database";

describe('refreshSession', () => {
  it('returns a 200 when the request is valid', () => {
    const request = createRequest();
    const response = createResponse({
      locals: {
        sessionId: 'session-id',
      },
    });
    const nextMock = jest.fn();

    const dbUpdateSessionMock = jest.spyOn(db, 'updateSession').mockReturnValueOnce();

    refreshSession(request, response, nextMock);

    expect(response.statusCode).toEqual(200);
    expect(nextMock).toHaveBeenCalled();
    expect(dbUpdateSessionMock).toHaveBeenCalledWith('session-id', {
      active: false,
    });
  });
});
