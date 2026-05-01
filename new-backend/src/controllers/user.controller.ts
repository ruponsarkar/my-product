import { Request, Response } from "express";
import { getTenantModels } from "../services/tenant.service";

export const getProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { User } = await getTenantModels(req);
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
