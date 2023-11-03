import { RequestHandler } from 'express';
import * as db from '../../data/database';
import { verifyJWT } from '../../utilities/auth';
import { hash } from '../../utilities/hashing';
import { SessionEntry } from '../../data/types';

export const refreshSession: RequestHandler = (request, response, next) => {
  const { refreshToken } = request.body;

  try {
    const userId = verifyJWT(refreshToken);
    const refreshTokenHash = hash(refreshToken, userId);
    const session = db.readSessionByRefreshTokenHash(refreshTokenHash);

    if (!session.active) {
      db.deleteAllSessionsByUserId(userId);
      throw new Error('Compromised refresh token');
    }

    if (!session) {
      throw new Error('Invalid refresh token');
    }

    const partialSessionDetails: Partial<SessionEntry> = {
      active: false,
    };

    db.updateSession(session.id, partialSessionDetails);
    response.locals.userId = userId;
    next();
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};
