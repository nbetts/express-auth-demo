import { RequestHandler } from 'express';
import * as db from '../../data/database';
import { verifyJWT } from '../../utilities/auth';
import { hash } from '../../utilities/hashing';

export const logOut: RequestHandler = (request, response) => {
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

    db.deleteSession(session.id);
    response.end();
  } catch (error) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }
};
