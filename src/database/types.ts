export type SessionEntry = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  active: boolean;
};

export type UserEntry = {
  id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  name: string;
};

export type Database = {
  sessions: Record<string, SessionEntry>;
  users: Record<string, UserEntry>;
};
