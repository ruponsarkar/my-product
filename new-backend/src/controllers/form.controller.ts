import { Request, Response } from 'express';
import Form from '../models/form.model';

export const getAllForms = async (req: Request, res: Response) => {
  const data = await Form.find();
  res.json(data);
};

export const createForm = async (req: Request & { user?: any }, res: Response) => {

  const item = new Form({...req.body, createdBy: req.user.id});
  await item.save();
  res.status(201).json(item);
};
