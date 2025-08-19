import { Router } from 'express';

import Paths from '../constants/paths';
import { expressjwt as jwt } from 'express-jwt';
import { checkSchema } from 'express-validator';
import checkValidationErrors from '../middleware/checkValidationErrors';
import env from '../env';
import {
  connectedFieldsVerifyBody,
} from '../validationSchemas/connectedfields';
import { verify } from '../services/connectedfields';

const connectedFieldsRouter = Router();

connectedFieldsRouter.post(
  Paths.ConnectedFields.Verify.Post,
  jwt({
    secret: env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
  }),
  checkSchema(connectedFieldsVerifyBody, ['body']),
  checkValidationErrors,
  verify,
);

export default connectedFieldsRouter;
