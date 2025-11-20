import { Router } from 'express';

import Paths from '../constants/paths';
import { verifyEmail, verifyPhoneNumber, verifyPostalAddress, verifyTypeaheadPostalAddress, verifySSN } from '../services/dataVerification.service';
import { expressjwt as jwt } from 'express-jwt';
import { checkSchema } from 'express-validator';
import { emailBody, phoneNumberBody, postalAddressBody, ssnBody } from '../validationSchemas/dataVerification';
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

dataVerificationRouter.post(
  Paths.Verify.PhoneNumber.Post,
  jwt({
    secret: env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
  }),
  checkSchema(phoneNumberBody, ['body']),
  checkValidationErrors,
  verifyPhoneNumber,
);

dataVerificationRouter.post(
  Paths.Verify.SSN.Post,
  jwt({
    secret: env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
  }),
  checkSchema(ssnBody, ['body']),
  checkValidationErrors,
  verifySSN,
);

dataVerificationRouter.post(
  Paths.Verify.PostalAddress.Post,
  jwt({
    secret: env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
  }),
  checkSchema(postalAddressBody, ['body']),
  checkValidationErrors,
  verifyPostalAddress,
);

dataVerificationRouter.post(
  Paths.Verify.TypeaheadAddress.Post,
  jwt({
    secret: env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
  }),
  checkSchema(postalAddressBody, ['body']),
  checkValidationErrors,
  verifyTypeaheadPostalAddress,
);

export default dataVerificationRouter;
