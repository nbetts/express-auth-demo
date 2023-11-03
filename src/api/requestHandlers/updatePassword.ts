import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import * as db from '../../data/database';
import { UserEntry } from '../../data/types';
import { hash } from '../../utilities/auth';

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
    const partialUserDetails: Partial<UserEntry> = {
      passwordHash: newPasswordHash,
      passwordSalt: newPasswordSalt,
    };

    db.updateUser(userId, partialUserDetails);
    response.locals.userId = userId;
    response.locals.deleteExistingSessions = true;
    next();
  } catch (error) {
    response.status(401).json({
      error: 'Incorrect password',
    });
  }
};
