import { RequestHandler } from 'express';
import * as db from '../../data/database';

export const logOut: RequestHandler = (request, response) => {
  const { sessionId } = response.locals;

  db.deleteSession(sessionId);
  response.end();
};
