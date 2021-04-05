import express from 'express';
import { save, list, } from '../controllers/integration.controller';

import { integrationValidator } from '../validators';

const router = express.Router();

router.post('/', integrationValidator.integrationSaveValidator, save);
router.get('/list', list);;

export default router;
