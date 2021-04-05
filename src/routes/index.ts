import integrationRouter from './integration.router';
import { Router } from 'express';

const router = Router();

router.use('/integration', integrationRouter);

export default router;
