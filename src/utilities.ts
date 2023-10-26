import { createHash } from 'crypto';
import { sign, verify } from 'jsonwebtoken';

const tokenExpiresIn = 60; // in seconds
const tokenSigningKey = 'my secret key';

export const hashPassword = (password: string) => {
  return createHash('sha256').update(password).digest('hex');
};

export const createSessionToken = (userId: string) => {
  const claims = { userId };
  return sign(claims, tokenSigningKey, { expiresIn: tokenExpiresIn });
};

export const verifySessionToken = (token: string) => {
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
