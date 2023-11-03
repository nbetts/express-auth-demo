import { RequestHandler } from 'express';
import * as db from '../../data/database';
import { UserEntry } from '../../data/types';

export const getUserDetails: RequestHandler = (request, response) => {
  const { userId } = response.locals;

  try {
    const user = db.readUser(userId);
    const partialUserDetails: Partial<UserEntry> = {
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
