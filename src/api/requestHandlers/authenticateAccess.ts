import { RequestHandler } from 'express';
import { verifyJWT } from '../../utilities/auth';

const authorizationHeaderPrefix = 'Bearer ';

export const authenticateAccess: RequestHandler = (request, response, next) => {
  const authorizationHeader = request.get('Authorization');

  if (!authorizationHeader?.startsWith(authorizationHeaderPrefix)) {
    response.status(401).json({
      error: 'Authorization header missing Bearer schema',
    });
    return;
  }

  try {
    const accessToken = authorizationHeader.split(authorizationHeaderPrefix)[1];
    response.locals.userId = verifyJWT(accessToken);
    next();
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};
