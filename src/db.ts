import { randomUUID } from 'crypto';
import { User } from './types';
import { createSessionToken, hashPassword } from './utilities';

const users: Record<string, User> = {};

export const createUser = (email: string, password: string) => {
  const existingUser = Object.entries(users).find(([, user]) => user.email === email);

  if (existingUser) {
    throw new Error('User already exists');
  }

  const userId = randomUUID();
  const user: User = {
    id: userId,
    email,
    hashedPassword: hashPassword(password),
    name: '',
  };

  users[userId] = user;
};

export const createSession = (email: string, password: string) => {
  const userEntry = Object.entries(users).find(([, user]) => user.email === email);

  if (!userEntry) {
    throw new Error('User does not exist');
  }

  const [userId, user] = userEntry;
  const hashedPassword = hashPassword(password);

  if (user.hashedPassword !== hashedPassword) {
    throw new Error(`Incorrect password`);
  }

  return createSessionToken(userId);
};

export const readUserDetails = (userId: string) => {
  const user = users[userId];

  if (!user) {
    throw new Error('User does not exist');
  }

  const userDetails: Partial<User> = {
    id: userId,
    email: user.email,
    name: user.name,
  };

  return userDetails;
};

export const updateUserDetails = (userId: string, name: string) => {
  const user = users[userId];

  if (!user) {
    throw new Error('User does not exist');
  }

  user.name = name;
};
