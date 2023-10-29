import { RequestHandler } from 'express';
import * as db from '../database';
import { createSessionTokens, hash, verifyJWT } from '../utilities';

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

export const createSession: RequestHandler = (request, response) => {
  const { userId } = response.locals;

  try {
    if (!userId) {
      throw new Error('Missing userId');
    }

    const sessionTokens = createSessionTokens(userId);
    response.json(sessionTokens);
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};

export const logIn: RequestHandler = (request, response, next) => {
  const { email, password } = request.body;

  try {
    const user = db.readUserByEmail(email);
    const passwordHash = hash(password, user.passwordSalt);

    if (user.passwordHash !== passwordHash) {
      throw new Error('Incorrect password');
    }

    response.locals.userId = user.id;
    next();
  } catch (error) {
    response.status(401).json({
      error: 'Incorrect email or password',
    });
  }
};

export const logOut: RequestHandler = (request, response) => {
  const { refreshToken } = request.body;

  try {
    const userId = verifyJWT(refreshToken);
    const refreshTokenHash = hash(refreshToken, userId);
    const storedRefreshTokenHash = db.readRefreshTokenHash(userId);

    if (refreshTokenHash !== storedRefreshTokenHash) {
      throw new Error('Invalid refresh token');
    }

    db.deleteRefreshTokenHash(userId);
    response.end();
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};

export const refreshSession: RequestHandler = (request, response, next) => {
  const { refreshToken } = request.body;

  try {
    const userId = verifyJWT(refreshToken);
    const refreshTokenHash = hash(refreshToken, userId);
    const storedRefreshTokenHash = db.readRefreshTokenHash(userId);

    if (refreshTokenHash !== storedRefreshTokenHash) {
      throw new Error('Invalid refresh token');
    }

    next();
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};
