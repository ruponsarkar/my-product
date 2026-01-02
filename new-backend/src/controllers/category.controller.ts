import { Request, Response } from "express";
// import Category from '../models/category.model';
import Product, { IProduct } from "../models/product.model";

export const allCategory = async (req: Request, res: Response) => {
  try {
    const data = await Product.distinct("category");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const allBrands = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    const data = await Product.distinct("brand", { category });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
