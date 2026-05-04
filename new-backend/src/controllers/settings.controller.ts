import { Request, Response } from 'express';
import Tenant from '../models/tenant.model';

const normalizeSettings = (value: any) => {
  if (!value) return {};
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn('Unable to parse string settings as JSON', error);
      return {};
    }
  }
  return typeof value === 'object' ? value : {};
};

export const getTenantSettings = async (req: Request & { user?: any }, res: Response) => {
  try {
    const tenant = await Tenant.findOne({ tenantId: req.user.tenantId });
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    return res.json(normalizeSettings(tenant.settings));
  } catch (err) {
    console.error('Failed to get tenant settings', err);
    return res.status(500).json({ message: 'Failed to load settings' });
  }
};

export const updateTenantSettings = async (req: Request & { user?: any }, res: Response) => {
  try {
    const tenant = await Tenant.findOne({ tenantId: req.user.tenantId });
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    tenant.settings = {
      ...normalizeSettings(tenant.settings),
      ...normalizeSettings(req.body),
    };

    await tenant.save();
    return res.json(normalizeSettings(tenant.settings));
  } catch (err) {
    console.error('Failed to update tenant settings', err);
    return res.status(500).json({ message: 'Failed to update settings' });
  }
};
