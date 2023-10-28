import { sign, verify } from 'jsonwebtoken';
import { hash } from './hashing';
import * as db from '../db';

const tokenSigningKey = 'my secret key';
const accessTokenExpiresIn = 60; // in seconds
const refreshTokenExpiresIn = 60 * 2; // in seconds

const createJWT = (userId: string, tokenType: 'accessToken' | 'refreshToken') => {
  const claims = { userId };
  const expiresIn = tokenType === 'accessToken' ? accessTokenExpiresIn : refreshTokenExpiresIn;
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
  const accessToken = createJWT(userId, 'accessToken');
  const refreshToken = createJWT(userId, 'refreshToken');
  const refreshTokenHash = hash(refreshToken, userId);
  db.createRefreshTokenHash(userId, refreshTokenHash);

  return {
    accessToken,
    refreshToken,
  };
};
