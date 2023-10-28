import { sign, verify } from 'jsonwebtoken';

const tokenExpiresIn = 60; // in seconds
const tokenSigningKey = 'my secret key';

export const createAccessToken = (userId: string) => {
  const claims = { userId };
  return sign(claims, tokenSigningKey, { expiresIn: tokenExpiresIn });
};

export const verifyAccessToken = (token: string) => {
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
