import { randomUUID } from 'crypto';
import { User } from './types';
import { createSessionToken, hashPassword } from './utilities';

const users: User[] = [{
  id: '45099f64-68ab-4a0f-a7b7-d9e7af529204',
  email: 'test@example.com',
  hashedPassword: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
  name: 'Nathan',
}];

export const createUser = (email: string, password: string) => {
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    id: randomUUID(),
    email,
    hashedPassword: hashPassword(password),
    name: '',
  };

  users.push(newUser);
};

export const createSession = (email: string, password: string) => {
  const existingUser = users.find((user) => user.email === email);

  if (!existingUser) {
    throw new Error('User does not exist');
  }

  const hashedPassword = hashPassword(password);

  if (existingUser.hashedPassword !== hashedPassword) {
    throw new Error(`Incorrect password`);
  }

  return createSessionToken(existingUser.id);
};

export const readUserDetails = (id: string) => {
  const user = users.find((user) => user.id === id);

  if (!user) {
    throw new Error('User does not exist');
  }

  const userDetails: Partial<User> = {
    id,
    email: user.email,
    name: user.name,
  };

  return userDetails;
};

export const updateUserDetails = (id: string, name: string) => {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex < 0) {
    throw new Error('User does not exist');
  }

  users[userIndex].name = name;
};
