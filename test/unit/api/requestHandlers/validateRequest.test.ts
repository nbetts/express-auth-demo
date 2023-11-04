import { validateRequest } from "../../../../src/api/requestHandlers";
import { createRequest, createResponse } from 'node-mocks-http';
import { checkSchema } from "express-validator";

describe('validateRequest', () => {
  it('returns a 200 when the request is valid', async () => {
    const request = createRequest();
    const response = createResponse();
    const nextMock = jest.fn();

    const validator = checkSchema({});
    await validator.run(request);

    validateRequest(request, response, nextMock);

    expect(response.statusCode).toEqual(200);
    expect(nextMock).toHaveBeenCalled();
  });

  it('returns a 400 when the request is invalid', async () => {
    const request = createRequest();
    const response = createResponse();
    const nextMock = jest.fn();

    const validator = checkSchema({
      requiredField: {
        notEmpty: true,
        errorMessage: 'error-message',
      },
    });
    await validator.run(request);

    validateRequest(request, response, nextMock);

    expect(response.statusCode).toEqual(400);
    expect(response._getJSONData()).toEqual({
      errors: {
        requiredField: 'error-message',
      },
    });
    expect(nextMock).not.toHaveBeenCalled();
  });
});
