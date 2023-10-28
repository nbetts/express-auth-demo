import { RequestHandler } from 'express';
import * as db from '../db';
import { createSessionTokens, hash, verifyJWT } from '../utilities';

const authorizationHeaderPrefix = 'Bearer ';

export const authenticateUser: RequestHandler = (request, response, next) => {
  const Authorization = request.get('Authorization');

  try {
    if (typeof Authorization !== 'string' || !Authorization.startsWith(authorizationHeaderPrefix)) {
      throw new Error('Invalid Authorization header');
    }

    const accessToken = Authorization.split(authorizationHeaderPrefix)[1];
    response.locals.userId = verifyJWT(accessToken);
    next();
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};

export const logIn: RequestHandler = (request, response) => {
  const { email, password } = request.body;

  try {
    const user = db.readUserByEmail(email);
    const passwordHash = hash(password, user.id);

    if (user.passwordHash !== passwordHash) {
      throw new Error(`Incorrect password`);
    }

    const sessionTokens = createSessionTokens(user.id);
    response.json(sessionTokens);
  } catch (error) {
    response.status(401).json({
      error: 'Incorrect email or password',
    });
  }
};

export const logOut: RequestHandler = (_request, response) => {
  // to do
};

export const refreshSession: RequestHandler = (request, response) => {
  const { refreshToken } = request.body;

  try {
    const userId = verifyJWT(refreshToken);
    const refreshTokenHash = hash(refreshToken, userId);
    const storedRefreshTokenHash = db.readRefreshTokenHash(userId);

    if (refreshTokenHash !== storedRefreshTokenHash) {
      throw new Error('Invalid refresh token');
    }

    const sessionTokens = createSessionTokens(userId);
    response.json(sessionTokens);
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};
