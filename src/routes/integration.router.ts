import express from 'express';
import { listIntegrations } from '../controllers/integration.controller';

import { integrationValidator } from '../validators';

const router = express.Router();

router.get('/', listIntegrations);;

export default router;
