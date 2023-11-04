import { RequestHandler } from 'express';
import * as db from '../../data/database';
import { hash } from '../../utilities/auth';

export const logIn: RequestHandler = (request, response, next) => {
  const { email, password } = request.body;

  try {
    const usersWithEmail = db.queryUsersByEmail(email);

    if (usersWithEmail.length < 1) {
      throw new Error('User with email does not exist');
    }

    const user = usersWithEmail[0];
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
