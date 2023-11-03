import { sign, verify } from 'jsonwebtoken';

const tokenSigningKey = 'my secret key';

export const createJWT = (userId: string, expiresIn: number) => {
  const claims = { userId };
  return sign(claims, tokenSigningKey, { expiresIn });
};

export const verifyJWT = (token: string) => {
  let decodedToken;

  try {
    decodedToken = verify(token, tokenSigningKey);
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
