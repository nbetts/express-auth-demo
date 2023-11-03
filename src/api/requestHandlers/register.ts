import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import * as db from '../../data/database';
import { UserEntry } from '../../data/types';
import { hash } from '../../utilities/auth';

export const register: RequestHandler = (request, response, next) => {
  const { email, password, name } = request.body;

  try {
    const userId = randomUUID();
    const passwordSalt = randomUUID();
    const passwordHash = hash(password, passwordSalt);
    const user: UserEntry = {
      id: userId,
      email,
      passwordHash,
      passwordSalt,
      name: name.trim(),
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
