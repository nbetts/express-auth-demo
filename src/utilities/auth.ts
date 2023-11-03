import { createHash } from 'crypto';
import { sign, verify } from 'jsonwebtoken';

const hashPepper = 'my secret pepper';
const jwtSigningKey = 'my secret key';

export const hash = (input: string, salt: string) => {
  const combinedInput = input + salt + hashPepper;
  return createHash('sha256').update(combinedInput).digest('hex');
};

export const createJWT = (userId: string, expiresIn: number) => {
  const claims = { userId };
  return sign(claims, jwtSigningKey, { expiresIn });
};

export const verifyJWT = (token: string) => {
  let decodedToken;

  try {
    decodedToken = verify(token, jwtSigningKey);
  } catch (error) {
    throw new Error('Invalid JWT');
  }

  if (typeof decodedToken === 'string') {
    throw new Error('Invalid payload');
  }

  const { userId } = decodedToken;

  if (!userId) {
    throw new Error('Missing claim: userId');
  }

  return userId;
};
