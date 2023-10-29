import { sign, verify } from 'jsonwebtoken';
import { hash } from './hashing';
import * as db from '../database';

const tokenSigningKey = 'my secret key';
const accessTokenExpiresInSeconds = 60;
const refreshTokenExpiresInSeconds = 60 * 2;

const createJWT = (userId: string, expiresIn: number) => {
  const claims = { userId };
  return sign(claims, tokenSigningKey, { expiresIn });
};

export const verifyJWT = (token: string) => {
  const decodedToken = verify(token, tokenSigningKey);

  if (typeof decodedToken === 'string') {
    throw new Error('Invalid token');
  }

  const { userId } = decodedToken;

  if (!userId) {
    throw new Error('Missing claim: userId');
  }

  return userId;
};

export const createSessionTokens = (userId: string) => {
  const accessToken = createJWT(userId, accessTokenExpiresInSeconds);
  const refreshToken = createJWT(userId, refreshTokenExpiresInSeconds);
  const refreshTokenHash = hash(refreshToken, userId);
  db.createRefreshTokenHash(userId, refreshTokenHash);

  return {
    accessToken,
    refreshToken,
  };
};
