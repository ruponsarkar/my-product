import { Request, Response } from "express";
import User from "../models/user.model";

export const getProfile = async (req: Request & { user?: any }, res: Response) => {

  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  } 
};
