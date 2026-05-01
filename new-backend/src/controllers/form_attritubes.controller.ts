import { Request, Response } from 'express';
import { getTenantModels } from '../services/tenant.service';

export const getAllForm_attritubess = async (req: Request, res: Response) => {
  const { FormAttributes } = await getTenantModels(req);
  const data = await FormAttributes.find();
  res.json(data);
};

export const createForm_attritubes = async (req: Request, res: Response) => {
  const { FormAttributes } = await getTenantModels(req);
  const item = new FormAttributes(req.body);
  await item.save();
  res.status(201).json(item);
};
