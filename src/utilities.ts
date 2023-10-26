import { createHash } from 'crypto';
import { sign, verify } from 'jsonwebtoken';

const signingKey = 'my secret key';

export const hashPassword = (password: string) => {
  return createHash('sha256').update(password).digest('hex');
};

export const createSessionToken = (userId: string) => {
  const claims = { userId };
  return sign(claims, signingKey, { expiresIn: 60 });
};

export const verifySessionToken = (token: string) => {
  const decodedToken = verify(token, signingKey);

  if (typeof decodedToken === 'string') {
    throw new Error('Invalid token');
  }

  const { userId } = decodedToken;

  if (!userId) {
    throw new Error('Missing claim: userId');
  }

  return userId;
};
