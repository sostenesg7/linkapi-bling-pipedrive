import { Request, Response, NextFunction } from 'express';
import { Integration } from '../models';
import { IntegrationDoc } from '../types/integration.types';
import { Types } from 'mongoose';
import { CustomRequest, EnvType } from '../types/common.types';
import { blingAPI, pipedriveAPI } from '../apis';
import { Order } from '../types/bling.types';

const { PIPEDRIVE_API_KEY }: EnvType = process.env;

const listIntegrations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const integratons = Integration.find({});
    return res.json(integratons);
  } catch (error) {
    next();
  }
};

export { listIntegrations };
