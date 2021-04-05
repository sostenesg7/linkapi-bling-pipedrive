import express from 'express';
import { createOrder } from '../controllers/integration.controller';

import { integrationValidator } from '../validators';

const router = express.Router();

// router.post('/', integrationValidator.integrationSaveValidator, save);
router.get('/', createOrder);;

export default router;
