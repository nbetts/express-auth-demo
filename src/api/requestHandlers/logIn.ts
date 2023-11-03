import { RequestHandler } from 'express';
import * as db from '../../data/database';
import { hash } from '../../utilities/hashing';

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
