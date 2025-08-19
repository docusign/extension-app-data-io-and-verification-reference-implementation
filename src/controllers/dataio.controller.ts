import { Router } from 'express';

import Paths from '../constants/paths';
import { createRecord, getTypeDefinitions, getTypeNames } from '../services/dataio.service';
import { expressjwt as jwt } from 'express-jwt';
import { checkSchema } from 'express-validator';
import { dataIOCreateRecordBody, dataIOGetTypeDefinitionsRecordBody, dataIOGetTypeNamesRecordBody } from '../validationSchemas/dataio';
import checkValidationErrors from '../middleware/checkValidationErrors';
import env from '../env';

const dataIORouter = Router();

dataIORouter.post(
  Paths.DataIO.CreateRecord.Post,
  jwt({
    secret: env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
  }),
  checkSchema(dataIOCreateRecordBody, ['body']),
  checkValidationErrors,
  createRecord,
);

dataIORouter.post(
  Paths.DataIO.GetTypeNames.Post,
  jwt({
    secret: env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
  }),
  checkSchema(dataIOGetTypeNamesRecordBody, ['body']),
  checkValidationErrors,
  getTypeNames,
);

dataIORouter.post(
  Paths.DataIO.GetTypeDefinitions.Post,
  jwt({
    secret: env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
  }),
  checkSchema(dataIOGetTypeDefinitionsRecordBody, ['body']),
  checkValidationErrors,
  getTypeDefinitions,
);



export default dataIORouter;
