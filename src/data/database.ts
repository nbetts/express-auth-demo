import { Database, SessionEntry, UserEntry } from './types';

let db: Database = {
  sessions: {},
  users: {},
};

export const createDatabase = (database: Database) => {
  db = database;
};

export const createSession = (session: SessionEntry) => {
  const entry = db.sessions[session.id];

  if (entry) {
    throw new Error('Session already exists');
  }

  db.sessions[session.id] = session;
};

export const readSessionByRefreshTokenHash = (refreshTokenHash: string) => {
  const entry = Object.values(db.sessions).find((session) => session.refreshTokenHash === refreshTokenHash);

  if (!entry) {
    throw new Error('Session does not exist');
  }

  return entry;
};

export const updateSession = (sessionId: string, partialSessionDetails: Partial<SessionEntry>) => {
  const entry = db.sessions[sessionId];

  if (!entry) {
    throw new Error('Session does not exist');
  }

  db.sessions[sessionId] = {
    ...entry,
    ...partialSessionDetails,
  };
};

export const deleteSession = (sessionId: string) => {
  const entry = db.sessions[sessionId];

  if (!entry) {
    throw new Error('Session does not exist');
  }

  delete db.sessions[sessionId];
};

export const deleteAllSessionsByUserId = (userId: string) => {
  for (const sessionId in db.sessions) {
    if (db.sessions[sessionId].userId === userId) {
      delete db.sessions[sessionId];
    }
  }
};

export const createUser = (user: UserEntry) => {
  const entryById = db.users[user.id];

  if (entryById) {
    throw new Error('User with ID already exists');
  }

  const entryByEmail = Object.values(db.users).find((existingUser) => existingUser.email === user.email);

  if (entryByEmail) {
    throw new Error('User with email already exists');
  }

  db.users[user.id] = user;
};

export const readUser = (userId: string) => {
  const entry = db.users[userId];

  if (!entry) {
    throw new Error('User does not exist');
  }

  return entry;
};

export const queryUsersByEmail = (email: string) => {
  return Object.values(db.users).filter((user) => user.email === email);
};

export const updateUser = (userId: string, partialUserDetails: Partial<UserEntry>) => {
  const entry = db.users[userId];

  if (!entry) {
    throw new Error('User does not exist');
  }

  db.users[userId] = {
    ...entry,
    ...partialUserDetails,
  };
};
