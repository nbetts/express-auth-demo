import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import * as db from '../../data/database';
import { UserEntry } from '../../data/types';
import { hash } from '../../utilities/auth';

export const register: RequestHandler = (request, response, next) => {
  const { email, password, name } = request.body;

  try {
    const usersWithEmail = db.queryUsersByEmail(email);

    if (usersWithEmail.length > 0) {
      throw new Error('User with email already exists');
    }

    const userId = randomUUID();
    const passwordSalt = randomUUID();
    const passwordHash = hash(password, passwordSalt);
    const user: UserEntry = {
      id: userId,
      email,
      passwordHash,
      passwordSalt,
      name,
    };

    db.createUser(user);
    response.locals.userId = user.id;
    response.statusCode = 201;
    next();
  } catch (error) {
    response.status(409).json({
      error: 'User with email already exists',
    });
  }
};
