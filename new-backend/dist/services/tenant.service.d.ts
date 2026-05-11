import { Request } from 'express';
import { Connection, Model } from 'mongoose';
export type TenantModelFactory = (conn: Connection) => Model<any>;
export declare const tenantModelFactories: TenantModelFactory[];
export interface TenantModels {
    User: Model<any>;
    Product: Model<any>;
    Order: Model<any>;
    Client: Model<any>;
    Form: Model<any>;
    FormAttributes: Model<any>;
    Analytic: Model<any>;
}
export declare const initializeTenantCollections: (conn: Connection) => Promise<void>;
export declare const getTenantModels: (req: Request & {
    user?: any;
}) => Promise<TenantModels>;
export declare const lookupTenant: (tenantSlug?: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/tenant.model").ITenant, {}, {}> & import("../models/tenant.model").ITenant & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
export declare const getTenantModelsBySlug: (tenantSlug?: string) => Promise<TenantModels>;
//# sourceMappingURL=tenant.service.d.ts.map