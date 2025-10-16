import { Request, Response } from 'express';
import Form_attritubes from '../models/form_attritubes.model';

export const getAllForm_attritubess = async (req: Request, res: Response) => {
  const data = await Form_attritubes.find();
  res.json(data);
};

export const createForm_attritubes = async (req: Request, res: Response) => {
  const item = new Form_attritubes(req.body);
  await item.save();
  res.status(201).json(item);
};
