import * as db from "../../../src/data/database";
import { Database, SessionEntry, UserEntry } from "../../../src/data/types";

describe('database', () => {
  describe('createSession', () => {
    it('creates a session entry', () => {
      const session: SessionEntry = {
        id: 'session-id',
        userId: 'user-id',
        refreshTokenHash: 'refresh-token-hash',
        active: true,
      };
      const mockDb: Database = {
        sessions: {},
        users: {},
      };

      db.createDatabase(mockDb);
      db.createSession(session);

      expect(Object.keys(mockDb.sessions)).toEqual([session.id]);
      expect(mockDb.sessions[session.id]).toEqual(session);
    });

    it('throws an error when an entry with session ID already exists', () => {
      const session: SessionEntry = {
        id: 'session-id',
        userId: 'user-id',
        refreshTokenHash: 'refresh-token-hash',
        active: true,
      };
      const mockDb: Database = {
        sessions: {
          [session.id]: session,
        },
        users: {},
      };

      db.createDatabase(mockDb);

      expect(() => db.createSession(session)).toThrow('Session already exists');
      expect(Object.keys(mockDb.sessions)).toEqual([session.id]);
      expect(mockDb.sessions[session.id]).toEqual(session);
    });
  });

  describe('readSessionByRefreshTokenHash', () => {
    it('reads a session entry by refresh token hash', () => {
      const session: SessionEntry = {
        id: 'session-id',
        userId: 'user-id',
        refreshTokenHash: 'refresh-token-hash',
        active: true,
      };
      const mockDb: Database = {
        sessions: {
          [session.id]: session,
        },
        users: {},
      };

      db.createDatabase(mockDb);
      const entry = db.readSessionByRefreshTokenHash(session.refreshTokenHash);

      expect(entry).toEqual(session);
      expect(Object.keys(mockDb.sessions)).toEqual([session.id]);
      expect(mockDb.sessions[session.id]).toEqual(session);
    });

    it('throws an error when an entry with session ID does not exist', () => {
      const session: SessionEntry = {
        id: 'session-id',
        userId: 'user-id',
        refreshTokenHash: 'refresh-token-hash',
        active: true,
      };
      const mockDb: Database = {
        sessions: {
          [session.id]: session,
        },
        users: {},
      };

      db.createDatabase(mockDb);

      expect(() => db.readSessionByRefreshTokenHash('invalid-refresh-token-hash')).toThrow('Session does not exist');
      expect(Object.keys(mockDb.sessions)).toEqual([session.id]);
      expect(mockDb.sessions[session.id]).toEqual(session);
    });
  });

  describe('updateSession', () => {
    it('updates a session entry', () => {
      const session: SessionEntry = {
        id: 'session-id',
        userId: 'user-id',
        refreshTokenHash: 'refresh-token-hash',
        active: true,
      };
      const partialSessionDetails: Partial<SessionEntry> = {
        active: false,
      };
      const mockDb: Database = {
        sessions: {
          [session.id]: session,
        },
        users: {},
      };

      db.createDatabase(mockDb);
      db.updateSession(session.id, partialSessionDetails);

      expect(Object.keys(mockDb.sessions)).toEqual([session.id]);
      expect(mockDb.sessions[session.id]).toEqual({ ...session, ...partialSessionDetails });
    });

    it('throws an error when an entry with session ID does not exist', () => {
      const session: SessionEntry = {
        id: 'session-id',
        userId: 'user-id',
        refreshTokenHash: 'refresh-token-hash',
        active: true,
      };
      const partialSessionDetails: Partial<SessionEntry> = {
        active: false,
      };
      const mockDb: Database = {
        sessions: {
          [session.id]: session,
        },
        users: {},
      };

      db.createDatabase(mockDb);

      expect(() => db.updateSession('invalid-session-id', partialSessionDetails)).toThrow('Session does not exist');
      expect(Object.keys(mockDb.sessions)).toEqual([session.id]);
      expect(mockDb.sessions[session.id]).toEqual(session);
    });
  });

  describe('deleteSession', () => {
    it('deletes a session entry', () => {
      const session1: SessionEntry = {
        id: 'session-id-1',
        userId: 'user-id',
        refreshTokenHash: 'refresh-token-hash',
        active: true,
      };
      const session2: SessionEntry = {
        id: 'session-id-2',
        userId: 'user-id',
        refreshTokenHash: 'refresh-token-hash',
        active: true,
      };
      const mockDb: Database = {
        sessions: {
          [session1.id]: session1,
          [session2.id]: session2,
        },
        users: {},
      };

      db.createDatabase(mockDb);
      db.deleteSession(session1.id);

      expect(Object.keys(mockDb.sessions)).toEqual([session2.id]);
      expect(mockDb.sessions[session2.id]).toEqual(session2);
    });

    it('throws an error when an entry with session ID does not exist', () => {
      const session1: SessionEntry = {
        id: 'session-id-1',
        userId: 'user-id',
        refreshTokenHash: 'refresh-token-hash',
        active: true,
      };
      const session2: SessionEntry = {
        id: 'session-id-2',
        userId: 'user-id',
        refreshTokenHash: 'refresh-token-hash',
        active: true,
      };
      const mockDb: Database = {
        sessions: {
          [session1.id]: session1,
          [session2.id]: session2,
        },
        users: {},
      };

      db.createDatabase(mockDb);

      expect(() => db.deleteSession('invalid-session-id')).toThrow('Session does not exist');
      expect(Object.keys(mockDb.sessions)).toEqual([session1.id, session2.id]);
      expect(mockDb.sessions[session1.id]).toEqual(session1);
      expect(mockDb.sessions[session2.id]).toEqual(session2);
    });
  });

  describe('deleteAllSessionsByUserId', () => {
    it('deletes all session entries for the given user ID', () => {
      const session1: SessionEntry = {
        id: 'session-id-1',
        userId: 'user-id-1',
        refreshTokenHash: 'refresh-token-hash-1',
        active: false,
      };
      const session2: SessionEntry = {
        id: 'session-id-2',
        userId: 'user-id-1',
        refreshTokenHash: 'refresh-token-hash-2',
        active: true,
      };
      const session3: SessionEntry = {
        id: 'session-id-3',
        userId: 'user-id-2',
        refreshTokenHash: 'refresh-token-hash-3',
        active: true,
      };
      const mockDb: Database = {
        sessions: {
          [session1.id]: session1,
          [session2.id]: session2,
          [session3.id]: session3,
        },
        users: {},
      };

      db.createDatabase(mockDb);
      db.deleteAllSessionsByUserId(session1.userId);

      expect(Object.keys(mockDb.sessions)).toEqual([session3.id]);
      expect(mockDb.sessions[session3.id]).toEqual(session3);
    });
  });

  describe('createUser', () => {
    it('creates a user entry', () => {
      const user: UserEntry = {
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'password-hash',
        passwordSalt: 'password-salt',
        name: 'name',
      };
      const mockDb: Database = {
        sessions: {},
        users: {},
      };

      db.createDatabase(mockDb);
      db.createUser(user);

      expect(Object.keys(mockDb.users)).toEqual([user.id]);
      expect(mockDb.users[user.id]).toEqual(user);
    });

    it('throws an error when an entry with user ID already exists', () => {
      const user: UserEntry = {
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'password-hash',
        passwordSalt: 'password-salt',
        name: 'name',
      };
      const mockDb: Database = {
        sessions: {},
        users: {
          [user.id]: user,
        },
      };

      db.createDatabase(mockDb);

      expect(() => db.createUser(user)).toThrow('User with ID already exists');
      expect(Object.keys(mockDb.users)).toEqual([user.id]);
      expect(mockDb.users[user.id]).toEqual(user);
    });

    it('throws an error when an entry with user email already exists', () => {
      const user: UserEntry = {
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'password-hash',
        passwordSalt: 'password-salt',
        name: 'name',
      };
      const mockDb: Database = {
        sessions: {},
        users: {
          [user.id]: user,
        },
      };

      db.createDatabase(mockDb);

      expect(() => db.createUser({ ...user, id: 'user-id-2' })).toThrow('User with email already exists');
      expect(Object.keys(mockDb.users)).toEqual([user.id]);
      expect(mockDb.users[user.id]).toEqual(user);
    });
  });

  describe('readUser', () => {
    it('reads a user entry', () => {
      const user: UserEntry = {
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'password-hash',
        passwordSalt: 'password-salt',
        name: 'name',
      };
      const mockDb: Database = {
        sessions: {},
        users: {
          [user.id]: user,
        },
      };

      db.createDatabase(mockDb);
      const entry = db.readUser(user.id);

      expect(entry).toEqual(user);
      expect(Object.keys(mockDb.users)).toEqual([user.id]);
      expect(mockDb.users[user.id]).toEqual(user);
    });

    it('throws an error when an entry with user ID does not exist', () => {
      const user: UserEntry = {
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'password-hash',
        passwordSalt: 'password-salt',
        name: 'name',
      };
      const mockDb: Database = {
        sessions: {},
        users: {
          [user.id]: user,
        },
      };

      db.createDatabase(mockDb);

      expect(() => db.readUser('invalid-user-id')).toThrow('User does not exist');
      expect(Object.keys(mockDb.users)).toEqual([user.id]);
      expect(mockDb.users[user.id]).toEqual(user);
    });
  });

  describe('readUserByEmail', () => {
    it('reads a user entry by email', () => {
      const user: UserEntry = {
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'password-hash',
        passwordSalt: 'password-salt',
        name: 'name',
      };
      const mockDb: Database = {
        sessions: {},
        users: {
          [user.id]: user,
        },
      };

      db.createDatabase(mockDb);
      const entry = db.readUserByEmail(user.email);

      expect(entry).toEqual(user);
      expect(Object.keys(mockDb.users)).toEqual([user.id]);
      expect(mockDb.users[user.id]).toEqual(user);
    });

    it('throws an error when an entry with user email does not exist', () => {
      const user: UserEntry = {
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'password-hash',
        passwordSalt: 'password-salt',
        name: 'name',
      };
      const mockDb: Database = {
        sessions: {},
        users: {
          [user.id]: user,
        },
      };

      db.createDatabase(mockDb);

      expect(() => db.readUserByEmail('invalid-email')).toThrow('User does not exist');
      expect(Object.keys(mockDb.users)).toEqual([user.id]);
      expect(mockDb.users[user.id]).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('updates a user entry', () => {
      const user: UserEntry = {
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'password-hash',
        passwordSalt: 'password-salt',
        name: 'name',
      };
      const partialUserDetails: Partial<UserEntry> = {
        name: 'updated-name',
      };
      const mockDb: Database = {
        sessions: {},
        users: {
          [user.id]: user,
        },
      };

      db.createDatabase(mockDb);
      db.updateUser(user.id, partialUserDetails);

      expect(Object.keys(mockDb.users)).toEqual([user.id]);
      expect(mockDb.users[user.id]).toEqual({ ...user, ...partialUserDetails });
    });

    it('throws an error when an entry with user ID does not exist', () => {
      const user: UserEntry = {
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'password-hash',
        passwordSalt: 'password-salt',
        name: 'name',
      };
      const partialUserDetails: Partial<UserEntry> = {
        name: 'updated-name',
      };
      const mockDb: Database = {
        sessions: {},
        users: {
          [user.id]: user,
        },
      };

      db.createDatabase(mockDb);

      expect(() => db.updateUser('invalid-user-id', partialUserDetails)).toThrow('User does not exist');
      expect(Object.keys(mockDb.users)).toEqual([user.id]);
      expect(mockDb.users[user.id]).toEqual(user);
    });
  });
});
