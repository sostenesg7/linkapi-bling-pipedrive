import express from 'express';
import { createOrder, listOrders } from '../controllers/integration.controller';

import { integrationValidator } from '../validators';

const router = express.Router();

// router.post('/', integrationValidator.integrationSaveValidator, save);
router.get('/', createOrder);;

router.get('/list', listOrders);;

export default router;
