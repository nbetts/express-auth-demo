import { createHash } from 'crypto';

const pepper = 'my secret pepper';

export const hash = (input: string, salt: string) => {
  const combinedInput = input + salt + pepper;
  return createHash('sha256').update(combinedInput).digest('hex');
};
