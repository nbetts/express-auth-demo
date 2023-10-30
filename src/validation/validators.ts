import { checkSchema } from "express-validator";
import * as schemas from './schemas';

export const registerValidator = checkSchema({
  email: schemas.emailSchema,
  password: schemas.passwordSchema,
  name: schemas.nameSchema,
}, ['body']);

export const logInValidator = checkSchema({
  email: schemas.emailSchema,
  password: schemas.passwordSchema,
}, ['body']);

export const logOutValidator = checkSchema({
  refreshToken: schemas.refreshTokenSchema,
}, ['body']);

export const refreshSessionValidator = checkSchema({
  refreshToken: schemas.refreshTokenSchema,
}, ['body']);

export const updateUserValidator = checkSchema({
  name: schemas.nameSchema,
}, ['body']);

export const updatePasswordValidator = checkSchema({
  currentPassword: schemas.passwordSchema,
  newPassword: schemas.passwordSchema,
}, ['body']);
