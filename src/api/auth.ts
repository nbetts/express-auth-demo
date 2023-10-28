import { RequestHandler } from 'express';
import * as db from '../db';
import { createAccessToken, hash, verifyAccessToken } from '../utilities';
import { randomUUID } from 'crypto';
import { User } from '../types';

const authorizationHeaderPrefix = 'Bearer ';

export const authenticateUser: RequestHandler = (request, response, next) => {
  const Authorization = request.get('Authorization');

  try {
    if (typeof Authorization !== 'string' || !Authorization.startsWith(authorizationHeaderPrefix)) {
      throw new Error('Invalid Authorization header');
    }

    const accessToken = Authorization.split(authorizationHeaderPrefix)[1];
    response.locals.userId = verifyAccessToken(accessToken);
    next();
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};

export const register: RequestHandler = (request, response, next) => {
  const { email, password, name } = request.body;

  try {
    const userId = randomUUID();
    const passwordHash = hash(password, userId);
    const user: User = {
      id: userId,
      email,
      passwordHash,
      name,
    };

    db.createUser(user);
    next();
  } catch (error) {
    response.status(409).json({
      error: 'User already exists',
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

    const accessToken = createAccessToken(user.id);
    response.setHeader('Authorization', authorizationHeaderPrefix + accessToken);
    response.end();
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
  // to do
};
