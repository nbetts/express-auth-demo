import { createHash } from 'crypto';

const pepper = 'my secret pepper';

export const createPasswordHash = (password: string, salt: string) => {
  const hashInput = password + salt + pepper;
  return createHash('sha256').update(hashInput).digest('hex');
};
