import { RequestHandler } from 'express';
import * as db from './db';
import { verifySessionToken } from './utilities';

const authorizationHeaderPrefix = 'Bearer ';

export const authenticateUser: RequestHandler = (request, response, next) => {
  const Authorization = request.get('Authorization');

  try {
    if (typeof Authorization !== 'string') {
      throw new Error('Invalid Authorization header');
    }

    const sessionToken = Authorization.split(authorizationHeaderPrefix)[1];
    request.userId = verifySessionToken(sessionToken);
    next();
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};

export const getUser: RequestHandler = (request, response) => {
  try {
    const userDetails = db.readUserDetails(request.userId);
    response.json(userDetails);
  } catch (error) {
    response.status(404).json({
      error: 'User not found',
    });
  }
};

export const updateUser: RequestHandler = (request, response) => {
  const { name } = request.body;

  try {
    db.updateUserDetails(request.userId, name);
    response.end();
  } catch (error) {
    response.status(404).json({
      error: 'User not found',
    });
  }
};

export const register: RequestHandler = (request, response, next) => {
  const { email, password } = request.body;

  try {
    db.createUser(email, password);
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
    const sessionToken = db.createSession(email, password);
    response.setHeader('Authorization', authorizationHeaderPrefix + sessionToken);
    response.end();
  } catch (error) {
    response.status(401).json({
      error: 'Incorrect email or password',
    });
  }
};

export const logOut: RequestHandler = (request, response) => {
  //
};
