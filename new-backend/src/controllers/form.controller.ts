import { Request, Response } from 'express';
import { getTenantModels } from '../services/tenant.service';

export const getAllForms = async (req: Request, res: Response) => {
  const { Form } = await getTenantModels(req);
  const data = await Form.find();
  res.json(data);
};

export const createForm = async (req: Request & { user?: any }, res: Response) => {
  const { Form } = await getTenantModels(req);
  const item = new Form({ ...req.body, createdBy: req.user.id });
  await item.save();
  res.status(201).json(item);
};
