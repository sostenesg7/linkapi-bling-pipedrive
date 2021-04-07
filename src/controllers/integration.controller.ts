import { Request, Response, NextFunction } from 'express';
import { Integration } from '../models';
import { EnvType } from '../types/common.types';
import { startIntegration } from '../services/pipedrive.service';

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

const startManualIntegration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const data = await startIntegration();
    return res.json(data);
  } catch (error) {
    next();
  }
};

export { listIntegrations, startManualIntegration };
