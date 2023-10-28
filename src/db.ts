import { User } from './types';

type Database = {
  refreshTokens: Record<string, string>;
  users: Record<string, User>;
};

const db: Database = {
  users: {},
  refreshTokens: {},
};

export const createRefreshToken = () => {

}

export const createUser = (user: User) => {
  const userEntry = Object.values(db.users).find((existingUser) => existingUser.email === user.email);

  if (userEntry) {
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
