import { RequestHandler } from 'express';
import { verifyJWT } from '../../utilities/auth';

const authorizationHeaderPrefix = 'Bearer ';

export const authenticateUser: RequestHandler = (request, response, next) => {
  const authorizationHeader = request.get('Authorization');

  try {
    if (typeof authorizationHeader !== 'string' || !authorizationHeader.startsWith(authorizationHeaderPrefix)) {
      throw new Error('Invalid Authorization header');
    }

    const accessToken = authorizationHeader.split(authorizationHeaderPrefix)[1];
    response.locals.userId = verifyJWT(accessToken);
    next();
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};
