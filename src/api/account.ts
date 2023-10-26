import { RequestHandler } from 'express';
import * as db from '../db';

export const getUser: RequestHandler = (request, response) => {
  try {
    const userDetails = db.readUserDetails(request.userId);
    response.json(userDetails);
  } catch (error) {
    response.status(404).json({
      error: 'User not found',
    });
  }
};

export const updateUser: RequestHandler = (request, response) => {
  const { name } = request.body;

  try {
    db.updateUserDetails(request.userId, name);
    response.end();
  } catch (error) {
    response.status(404).json({
      error: 'User not found',
    });
  }
};
