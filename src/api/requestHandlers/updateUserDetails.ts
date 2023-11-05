import { RequestHandler } from 'express';
import * as db from '../../data/database';
import { UserEntry } from '../../data/types';

export const updateUserDetails: RequestHandler = (request, response) => {
  const { userId } = response.locals;
  const { name } = request.body;
  const partialUserDetails: Partial<UserEntry> = {
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
