import { Request, Response } from "express";
import { getTenantModels } from "../services/tenant.service";

export const allCategory = async (req: Request, res: Response) => {
  try {
    const { Product } = await getTenantModels(req);
    const data = await Product.distinct("category");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const allBrands = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { Product } = await getTenantModels(req);

    const data = await Product.distinct("brand", { category });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
