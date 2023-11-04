import { authenticateUser } from "../../../../src/api/requestHandlers";
import { createRequest, createResponse } from 'node-mocks-http';
import * as authUtilities from "../../../../src/utilities/auth";

describe('authenticateUser', () => {
  it('returns a 200 when the access token is valid', () => {
    const request = createRequest({
      headers: {
        authorization: 'Bearer mock-access-token',
      },
    });
    const response = createResponse();
    const nextFunction = jest.fn();
    jest.spyOn(authUtilities, 'verifyJWT').mockReturnValueOnce('user-id');

    authenticateUser(request, response, nextFunction);

    expect(response.statusCode).toEqual(200);
    expect(response.locals.userId).toEqual('user-id');
    expect(response._isJSON()).toEqual(false);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('returns a 401 when the Authorization header is empty', () => {
    const request = createRequest();
    const response = createResponse();
    const nextFunction = jest.fn();

    authenticateUser(request, response, nextFunction);

    expect(response.statusCode).toEqual(401);
    expect(response.locals.userId).toBeUndefined();
    expect(response._getJSONData()).toEqual({
      error: 'Authorization header missing Bearer schema',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('returns a 401 when the Authorization header is missing the Bearer schema', () => {
    const request = createRequest({
      headers: {
        authorization: 'invalid-authorization-header',
      },
    });
    const response = createResponse();
    const nextFunction = jest.fn();

    authenticateUser(request, response, nextFunction);

    expect(response.statusCode).toEqual(401);
    expect(response.locals.userId).toBeUndefined();
    expect(response._getJSONData()).toEqual({
      error: 'Authorization header missing Bearer schema',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('returns a 401 when the access token is invalid', () => {
    const request = createRequest({
      headers: {
        authorization: 'Bearer invalid-access-token',
      },
    });
    const response = createResponse();
    const nextFunction = jest.fn();

    authenticateUser(request, response, nextFunction);

    expect(response.statusCode).toEqual(401);
    expect(response.locals.userId).toBeUndefined();
    expect(response._getJSONData()).toEqual({
      error: 'Unauthorized',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
