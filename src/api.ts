import { RequestHandler } from 'express';
import * as db from './db';
import { verifySessionToken } from './utilities';

export const authorizeRequest: RequestHandler = (req, res, next) => {
  const Authorization = req.get('Authorization');

  try {
    if (typeof Authorization !== 'string') {
      throw new Error('Invalid Authorization header');
    }

    req.userId = verifySessionToken(Authorization);
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
    });
  }
};

export const getUser: RequestHandler = (req, res) => {
  try {
    const userDetails = db.readUserDetails(req.userId);
    res.json(userDetails);
  } catch (error) {
    res.status(404).json({
      error: 'User not found',
    });
  }
};

export const register: RequestHandler = (req, res) => {
  const { email, password } = req.body;

  try {
    db.createUser(email, password);
    res.end();
  } catch (error) {
    res.status(409).json({
      error: 'User already exists',
    });
  }
};

export const logIn: RequestHandler = (req, res) => {
  const { email, password } = req.body;

  try {
    const sessionToken = db.createSession(email, password);
    res.setHeader('Authorization', sessionToken);
    res.end();
  } catch (error) {
    res.status(401).json({
      error: 'Incorrect email or password',
    });
  }
};

export const logOut: RequestHandler = (req, res) => {
  //
};
