import { Router } from "express";
import Paths from "../constants/paths";
import connectedFieldsRouter from "./connectedfields.controller";
import dataVerificationRouter from "./dataVerification.controller";
import dataIORouter from "./dataio.controller"
import authRouter from "./auth.controller";

const apiRouter = Router();

apiRouter.use(Paths.ConnectedFields.Base, connectedFieldsRouter);
apiRouter.use(Paths.DataIO.Base, dataIORouter);
apiRouter.use(Paths.Verify.Base, dataVerificationRouter);

apiRouter.use(Paths.Auth.Base, authRouter);

export default apiRouter;
