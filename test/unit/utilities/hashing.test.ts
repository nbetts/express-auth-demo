import { hash } from "../../../src/utilities/hashing";

describe('hashing utilities', () => {
  it('hashes a password using sha256 and hex, with a given salt and pepper', () => {
    const password = 'password';
    const salt = 'salt';
    const passwordHash = hash(password, salt);
    expect (passwordHash).toEqual('4109a67341ecfe9b74344344d2274ec5a827436db56992c44948f9a27896c4f4');
  });
});
