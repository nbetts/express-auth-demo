import { createJWT, hash, verifyJWT } from "../../../src/utilities/auth";
import jsonwebtoken from 'jsonwebtoken';

describe('auth utilities', () => {
  beforeAll(() => {
    jest.setSystemTime();
  });

  describe('hash', () => {
    it('returns a hashed input using sha256 and hex, with a given salt and pepper', () => {
      const input = 'hello';
      const salt = 'salt';
      const inputHash = hash(input, salt);
      expect (inputHash).toEqual('2d405fc47b85b8d89d76bab131697949508b71e92a727c9ef4fb2821c59c1228');
    });
  });

  describe('createJWT', () => {
    it('creates a JWT with a given userId claim, and expiry time', () => {
      const userId = 'user-id';
      const jwt = createJWT(userId, 1);
      expect(jwt).toEqual('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLWlkIiwiaWF0IjowLCJleHAiOjF9.p7TVokBoWOCkYINGD6eBcbBnsQVnyQG8sYl47U6SYOI');
    });
  });

  describe('verifyJWT', () => {
    it('returns the userId claim when the JWT is valid', () => {
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLWlkIiwiaWF0IjowLCJleHAiOjF9.p7TVokBoWOCkYINGD6eBcbBnsQVnyQG8sYl47U6SYOI';
      const userId = verifyJWT(jwt);
      expect(userId).toEqual('user-id');
    });

    it('throws an error when the JWT is invalid', () => {
      const jwt = 'invalid-token';
      expect(() => verifyJWT(jwt)).toThrow('Invalid JWT');
    });

    it('throws an error when the JWT payload is invalid', () => {
      jest.spyOn(jsonwebtoken, 'verify').mockImplementationOnce(() => 'mock-decoded-jwt');

      const jwt = 'mock-jwt';
      expect(() => verifyJWT(jwt)).toThrow('Invalid payload');
    });

    it('throws an error when the JWT is missing the userId claim', () => {
      jest.spyOn(jsonwebtoken, 'verify').mockImplementationOnce(() => ({ userId: '' }));

      const jwt = 'mock-jwt';
      expect(() => verifyJWT(jwt)).toThrow('Missing claim: userId');
    });
  });
});
