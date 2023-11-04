import { validationResult } from "express-validator";
import { RequestHandler } from 'express';

export const validateRequest: RequestHandler = (request, response, next) => {
  const validation = validationResult(request);

  if (validation.isEmpty()) {
    next();
  } else {
    response.status(400).json({
      errors: validation.formatWith(error => error.msg).mapped(),
    });
  }
};
