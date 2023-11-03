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
  const entry = Object.values(db.users).find((existingUser) => existingUser.email === user.email);

  if (entry) {
    throw new Error('User already exists');
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

export const readUserByEmail = (email: string) => {
  const entry = Object.values(db.users).find((user) => user.email === email);

  if (!entry) {
    throw new Error('User does not exist');
  }

  return entry;
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
