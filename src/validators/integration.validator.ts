import { query } from 'express-validator';
import { validate } from '../middlewares/requestValidator.middleware';
import { errors } from '../util';
import { Types } from 'mongoose';

export const integrationFindValidator = validate([
  query('blingApiKey', errors.integration.blingApiKey)
    .notEmpty()
    .escape()
    .isLength({ min: 0, max: 100 }),
  query('pipedriveApiKey', errors.integration.pipedriveApiKey)
    .notEmpty()
    .escape()
    .isLength({ min: 0, max: 100 })
]);
