import { hash } from "../../../src/utilities/hashing";

describe('hashing utilities', () => {
  it('returns a hashed input using sha256 and hex, with a given salt and pepper', () => {
    const input = 'hello';
    const salt = 'salt';
    const inputHash = hash(input, salt);
    expect (inputHash).toEqual('2d405fc47b85b8d89d76bab131697949508b71e92a727c9ef4fb2821c59c1228');
  });
});
