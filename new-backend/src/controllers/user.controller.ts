import { Request, Response } from "express";
import { resolveTenant } from "../config/tenant";
import { getTenantModels } from "../services/tenant.service";
import { buildTenantAccessPayload } from "../services/subscription.service";

export const getProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { User } = await getTenantModels(req);
    const user = await User.findById(req.user.id).select("-password");
    const tenant = await resolveTenant({ tenantId: req.user?.tenantId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const payload = tenant ? buildTenantAccessPayload(tenant) : null;

    res.json({
      ...user.toObject(),
      tenant: payload?.tenant || null,
      access: payload?.access || null,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const listUsers = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { User } = await getTenantModels(req);
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const createUser = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { name, email, password, role, permissions } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const { User } = await getTenantModels(req);
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || "operator",
      permissions: Array.isArray(permissions) ? permissions : [],
      isActive: true,
    });
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateUser = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { name, role, permissions, isActive } = req.body;
    const userId = req.params.id;
    const { User } = await getTenantModels(req);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (typeof isActive === "boolean") user.isActive = isActive;
    if (permissions) user.permissions = Array.isArray(permissions) ? permissions : user.permissions;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
