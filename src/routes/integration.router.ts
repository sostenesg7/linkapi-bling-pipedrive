import express from 'express';
import { listIntegrations, startManualIntegration } from '../controllers/integration.controller';

import { integrationValidator } from '../validators';

const router = express.Router();

router.get('/', listIntegrations);
router.post('/', startManualIntegration);;

export default router;
