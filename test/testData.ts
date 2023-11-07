import { SessionEntry, UserEntry } from "../src/data/types";

export const testAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLWlkIiwiaWF0IjowLCJleHAiOjYwfQ.5zLRTVYm8fytd3fEkoLaiIXu8g--JtmOv_Uk3pCRERU';
export const testRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLWlkIiwiaWF0IjowLCJleHAiOjEyMH0.f6y3ASRBvnYCYOgdGLMVZB6nTzBbUpv7HtDU81_wejY';
export const testAuthorizationHeader = { Authorization: 'Bearer ' + testAccessToken };

export const testSession1: SessionEntry = Object.freeze({
  id: 'session-id-1',
  userId: 'user-id',
  refreshTokenHash: '2382accbd3959258b1400575304e140f9204f69a9039ac8b255c67d5412bc00d',
  active: true,
});

export const testSession2: SessionEntry = Object.freeze({
  id: 'session-id-2',
  userId: 'user-id',
  refreshTokenHash: '2382accbd3959258b1400575304e140f9204f69a9039ac8b255c67d5412bc00d',
  active: false,
});

export const testUser: UserEntry = Object.freeze({
  id: 'user-id',
  email: 'test@example.com',
  passwordHash: '0a41c0f4b4e2f603e5fef31175c59b3646ba2dab9c1f451f863ea0ce96792bb5',
  passwordSalt: '649b9933-ea50-4b97-a1b8-025c92506134',
  name: 'Nathan',
});
