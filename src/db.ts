import { User } from './types';

type Database = {
  refreshTokenHashes: Record<string, string>;
  users: Record<string, User>;
};

const db: Database = {
  users: {},
  refreshTokenHashes: {},
};

export const createRefreshTokenHash = (userId: string, tokenHash: string) => {
  db.refreshTokenHashes[userId] = tokenHash; // allow overwriting
};

export const readRefreshTokenHash = (userId: string) => {
  const token = db.refreshTokenHashes[userId];

  if (!token) {
    throw new Error('Refresh token does not exist');
  }

  return token;
};

export const createUser = (user: User) => {
  const existingEntry = Object.values(db.users).find((existingUser) => existingUser.email === user.email);

  if (existingEntry) {
    throw new Error('User already exists');
  }

  db.users[user.id] = user;
};

export const readUser = (userId: string) => {
  const user = db.users[userId];

  if (!user) {
    throw new Error('User does not exist');
  }

  return user;
};

export const readUserByEmail = (email: string) => {
  const user = Object.values(db.users).find((user) => user.email === email);

  if (!user) {
    throw new Error('User does not exist');
  }

  return user;
};

export const updateUser = (userId: string, partialUserDetails: Partial<User>) => {
  const user = db.users[userId];

  if (!user) {
    throw new Error('User does not exist');
  }

  db.users[userId] = {
    ...user,
    ...partialUserDetails,
  };
};
