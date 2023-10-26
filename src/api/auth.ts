import { RequestHandler } from 'express';
import * as db from '../db';
import { createSessionToken, hashPassword, verifySessionToken } from '../utilities';

const authorizationHeaderPrefix = 'Bearer ';

export const authenticateUser: RequestHandler = (request, response, next) => {
  const Authorization = request.get('Authorization');

  try {
    if (typeof Authorization !== 'string' || !Authorization.startsWith(authorizationHeaderPrefix)) {
      throw new Error('Invalid Authorization header');
    }

    const sessionToken = Authorization.split(authorizationHeaderPrefix)[1];
    response.locals.userId = verifySessionToken(sessionToken);
    next();
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};

export const register: RequestHandler = (request, response, next) => {
  const { email, password } = request.body;

  try {
    const hashedPassword = hashPassword(password);
    db.createUser(email, hashedPassword);
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
    const hashedPassword = hashPassword(password);

    if (user.hashedPassword !== hashedPassword) {
      throw new Error(`Incorrect password`);
    }

    const sessionToken = createSessionToken(user.id);
    response.setHeader('Authorization', authorizationHeaderPrefix + sessionToken);
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
