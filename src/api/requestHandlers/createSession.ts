import { RequestHandler } from 'express';
import { randomUUID } from 'crypto';
import * as db from '../../data/database';
import { createJWT, hash } from '../../utilities/auth';
import { SessionEntry } from '../../data/types';

export const accessTokenExpiresInSeconds = 60;
export const refreshTokenExpiresInSeconds = 60 * 2;

export const createSession: RequestHandler = (request, response) => {
  const { userId, deleteExistingSessions } = response.locals;

  if (!userId) {
    throw new Error('Missing userId');
  }

  if (deleteExistingSessions) {
    db.deleteAllSessionsByUserId(userId);
  }

  const accessToken = createJWT(userId, accessTokenExpiresInSeconds);
  const refreshToken = createJWT(userId, refreshTokenExpiresInSeconds);
  const sessionId = randomUUID();

  const session: SessionEntry = {
    id: sessionId,
    userId,
    refreshTokenHash: hash(refreshToken, userId),
    active: true,
  };

  db.createSession(session);
  response.json({ accessToken, refreshToken });
};
