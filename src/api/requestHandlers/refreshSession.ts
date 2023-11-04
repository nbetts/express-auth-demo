import { RequestHandler } from 'express';
import * as db from '../../data/database';
import { SessionEntry } from '../../data/types';

export const refreshSession: RequestHandler = (request, response, next) => {
  const { sessionId } = response.locals;
  const partialSessionDetails: Partial<SessionEntry> = {
    active: false,
  };

  db.updateSession(sessionId, partialSessionDetails);
  next();
};
