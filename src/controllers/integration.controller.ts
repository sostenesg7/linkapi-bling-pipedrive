import { Request, Response, NextFunction } from 'express';
import { Integration } from '../models';
import { IntegrationDoc } from '../types/integration.types';
import { Types } from 'mongoose';
import { errors } from '../util';
import { CustomRequest } from '../types/common.types';
import { checkFilter, splitString } from '../util/helpers';
const ObjectId = Types.ObjectId;

/**
 * Integration list by director, title, genre and/or cast
 *
 * @param {Request} req
 * @param {Response} res
 * @return {*}  {Promise<Response>}
 */
const list = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {

  const baseQuery = {};

  try {
    const Integrations = await Integration.find({});

    return res.status(200).json(Integrations);
  } catch (error) {
    next();
  }
};

/**
 * User create
 *
 * @param {CustomRequest<IntegrationDoc>} req
 * @param {Response} res
 * @return {*}  {Promise<Response>}
 */
const save = async (
  req: CustomRequest<IntegrationDoc>,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const { id } = req.body;
    const integration: IntegrationDoc | null = await Integration.findOne({});

    return res.status(202).json(integration);
  } catch (error) {
    next(error);
  }
};


export { save, list };
