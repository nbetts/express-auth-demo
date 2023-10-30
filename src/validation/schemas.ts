import { ParamSchema, Schema } from "express-validator";

export const emailSchema: ParamSchema = {
  isEmail: {
    errorMessage: 'Must be a valid email address',
  },
};

export const passwordSchema: ParamSchema = {
  isLength: {
    options: {
      min: 2,
      max: 32,
    },
    errorMessage: 'Must be 2-32 characters long',
  },
  isStrongPassword: {
    options: {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    errorMessage: 'Must contain uppercase letters, lowercase letters, numbers, and symbols',
  },
};

export const nameSchema: ParamSchema = {
  trim: true,
  isAlpha: {
    options: 'en-GB',
    errorMessage: 'Must only contain letters',
  },
  isLength: {
    options: {
      min: 2,
      max: 32,
    },
    errorMessage: 'Must be 2-32 characters long',
  },
};

export const refreshTokenSchema: ParamSchema = {
  isJWT: {
    errorMessage: 'Must be JWT',
  },
};
