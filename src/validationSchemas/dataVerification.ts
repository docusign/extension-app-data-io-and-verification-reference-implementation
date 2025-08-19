import { Schema } from 'express-validator';

export const emailBody: Schema = {
  email: { isString: true }
};
