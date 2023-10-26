import { randomUUID } from 'crypto';
import { User } from './types';

const users: Record<string, User> = {};

export const createUser = (email: string, hashedPassword: string) => {
  const existingUser = Object.entries(users).find(([, user]) => user.email === email);

  if (existingUser) {
    throw new Error('User already exists');
  }

  const userId = randomUUID();
  const user: User = {
    id: userId,
    email,
    hashedPassword,
    name: '',
  };

  users[userId] = user;
};

export const readUser = (userId: string) => {
  const user = users[userId];

  if (!user) {
    throw new Error('User does not exist');
  }

  return user;
};

export const readUserByEmail = (email: string) => {
  const userEntry = Object.entries(users).find(([, user]) => user.email === email);

  if (!userEntry) {
    throw new Error('User does not exist');
  }

  const [, user] = userEntry;
  return user;
};

export const updateUser = (userId: string, partialUserDetails: Partial<User>) => {
  const user = users[userId];

  if (!user) {
    throw new Error('User does not exist');
  }

  users[userId] = {
    ...user,
    ...partialUserDetails,
  };
};
