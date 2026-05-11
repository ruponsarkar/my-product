import { Request } from 'express';
import { Connection, Model } from 'mongoose';
import { getTenantConnection, findTenant, resolveTenant } from '../config/tenant';
import { getUserModel } from '../models/user.model';
import { getProductModel } from '../models/product.model';
import { getOrderModel } from '../models/order.model';
import { getClientModel } from '../models/client.model';
import { getFormModel } from '../models/form.model';
import { getFormAttributesModel } from '../models/form_attritubes.model';
import { getAnalyticModel } from '../models/analytic.model';

export type TenantModelFactory = (conn: Connection) => Model<any>;

export const tenantModelFactories: TenantModelFactory[] = [
  getUserModel,
  getProductModel,
  getOrderModel,
  getClientModel,
  getFormModel,
  getFormAttributesModel,
  getAnalyticModel,
];

export interface TenantModels {
  User: Model<any>;
  Product: Model<any>;
  Order: Model<any>;
  Client: Model<any>;
  Form: Model<any>;
  FormAttributes: Model<any>;
  Analytic: Model<any>;
}

export const initializeTenantCollections = async (conn: Connection) => {
  const models = tenantModelFactories.map(factory => factory(conn));

  await Promise.all(
    models.map(async model => {
      try {
        await model.createCollection();
      } catch (err: any) {
        if (err && err.codeName !== 'NamespaceExists') {
          throw err;
        }
      }
      try {
        await model.syncIndexes();
      } catch (syncErr) {
        console.warn(`Failed to sync indexes for ${model.modelName}`, syncErr);
      }
    })
  );
};

const getTenantConnectionFromRequest = async (req: Request & { user?: any }): Promise<{ conn: Connection; tenant: any }> => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) {
    throw new Error('Tenant ID missing from request. Provide tenantId in the auth token.');
  }

  const tenant = await resolveTenant({ tenantId });
  if (!tenant) {
    throw new Error('Tenant not found for request');
  }

  return { conn: getTenantConnection(tenant), tenant };
};

export const getTenantModels = async (req: Request & { user?: any }): Promise<TenantModels> => {
  const { conn } = await getTenantConnectionFromRequest(req);

  return {
    User: getUserModel(conn),
    Product: getProductModel(conn),
    Order: getOrderModel(conn),
    Client: getClientModel(conn),
    Form: getFormModel(conn),
    FormAttributes: getFormAttributesModel(conn),
    Analytic: getAnalyticModel(conn),
  };
};

export const lookupTenant = async (tenantSlug?: string) => {
  if (!tenantSlug) return null;
  return findTenant({ tenantSlug });
};

export const getTenantModelsBySlug = async (tenantSlug?: string): Promise<TenantModels> => {
  const tenant = tenantSlug
    ? await resolveTenant({ tenantSlug })
    : await resolveTenant({});
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  const conn = getTenantConnection(tenant);

  return {
    User: getUserModel(conn),
    Product: getProductModel(conn),
    Order: getOrderModel(conn),
    Client: getClientModel(conn),
    Form: getFormModel(conn),
    FormAttributes: getFormAttributesModel(conn),
    Analytic: getAnalyticModel(conn),
  };
};
