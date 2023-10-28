import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import * as db from '../db';
import { User } from '../types';
import { hash } from '../utilities';

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

export const getUserDetails: RequestHandler = (request, response) => {
  try {
    const user = db.readUser(response.locals.userId);
    const partialUserDetails: Partial<User> = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    response.json(partialUserDetails);
  } catch (error) {
    response.status(404).json({
      error: 'User not found',
    });
  }
};

export const updateUserDetails: RequestHandler = (request, response) => {
  const { name } = request.body;
  const partialUserDetails: Partial<User> = {
    name,
  };

  try {
    db.updateUser(response.locals.userId, partialUserDetails);
    response.end();
  } catch (error) {
    response.status(404).json({
      error: 'User not found',
    });
  }
};
