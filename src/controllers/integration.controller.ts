import { Request, Response, NextFunction } from 'express';
import { Summary } from '../models';
import { startIntegration } from '../services/pipedrive.service';

/**
 * List all integrations per day
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*}  {(Promise<Response | undefined>)}
 */
const listIntegrations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const integratons = await Summary.find({});
    return res.json(integratons);
  } catch (error) {
    next();
  }
};

/**
 * Start a manual integration
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*}  {(Promise<Response | undefined>)}
 */
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
