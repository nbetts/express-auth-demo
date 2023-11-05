import { RequestHandler } from 'express';
import * as db from '../../data/database';
import { hash, verifyJWT } from '../../utilities/auth';

export const authenticateRefresh: RequestHandler = (request, response, next) => {
  const { refreshToken } = request.body;

  try {
    const userId = verifyJWT(refreshToken);
    const refreshTokenHash = hash(refreshToken, userId);
    const session = db.readSessionByRefreshTokenHash(refreshTokenHash);

    if (!session.active) {
      db.deleteAllSessionsByUserId(userId);
      throw new Error('Compromised refresh token');
    }

    response.locals.sessionId = session.id;
    response.locals.userId = userId;
    next();
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};
