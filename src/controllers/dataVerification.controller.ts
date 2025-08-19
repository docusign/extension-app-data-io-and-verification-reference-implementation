import { Router } from 'express';

import Paths from '../constants/paths';
import { verifyEmail } from '../services/emailVerification.service';
import { expressjwt as jwt } from 'express-jwt';
import { checkSchema } from 'express-validator';
import { emailBody } from '../validationSchemas/dataVerification';
import checkValidationErrors from '../middleware/checkValidationErrors';
import env from '../env';

const dataVerificationRouter = Router();

dataVerificationRouter.post(
  Paths.Verify.Email.Post,
  jwt({
    secret: env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
  }),
  checkSchema(emailBody, ['body']),
  checkValidationErrors,
  verifyEmail,
);

export default dataVerificationRouter;
