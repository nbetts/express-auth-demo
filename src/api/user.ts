import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import * as db from '../database';
import { User } from '../types';
import { createSessionTokens, hash } from '../utilities';

export const register: RequestHandler = (request, response, next) => {
  const { email, password, name } = request.body;

  try {
    const userId = randomUUID();
    const passwordSalt = randomUUID();
    const passwordHash = hash(password, passwordSalt);
    const user: User = {
      id: userId,
      email,
      passwordHash,
      passwordSalt,
      name,
    };

    db.createUser(user);
    response.locals.userId = user.id;
    next();
  } catch (error) {
    response.status(409).json({
      error: 'User already exists',
    });
  }
};

export const getUserDetails: RequestHandler = (request, response) => {
  const { userId } = response.locals;

  try {
    const user = db.readUser(userId);
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
  const { userId } = response.locals;
  const { name } = request.body;
  const partialUserDetails: Partial<User> = {
    name,
  };

  try {
    db.updateUser(userId, partialUserDetails);
    response.end();
  } catch (error) {
    response.status(404).json({
      error: 'User not found',
    });
  }
};

export const updatePassword: RequestHandler = (request, response, next) => {
  const { userId } = response.locals;
  const { currentPassword, newPassword } = request.body;

  try {
    const user = db.readUser(userId);
    const passwordHash = hash(currentPassword, user.passwordSalt);

    if (user.passwordHash !== passwordHash) {
      throw new Error('Incorrect password');
    }

    const newPasswordSalt = randomUUID();
    const newPasswordHash = hash(newPassword, newPasswordSalt);
    const partialUserDetails: Partial<User> = {
      passwordHash: newPasswordHash,
      passwordSalt: newPasswordSalt,
    };

    db.updateUser(userId, partialUserDetails);
    response.locals.userId = userId;
    next();
  } catch (error) {
    response.status(401).json({
      error: 'Incorrect password',
    });
  }
};
