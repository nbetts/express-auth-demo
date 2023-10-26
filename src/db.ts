import { User } from './types';

const users: Record<string, User> = {};

export const createUser = (user: User) => {
  const userEntry = Object.entries(users).find(([, existingUser]) => existingUser.email === user.email);

  if (userEntry) {
    throw new Error('User already exists');
  }

  users[user.id] = user;
};

export const readUser = (userId: string) => {
  const user = users[userId];

  if (!user) {
    throw new Error('User does not exist');
  }

  return user;
};

export const readUserByEmail = (email: string) => {
  const userEntry = Object.entries(users).find(([, existingUser]) => existingUser.email === email);

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
