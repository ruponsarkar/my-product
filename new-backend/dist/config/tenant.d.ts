import mongoose, { Types } from 'mongoose';
import { ITenant } from '../models/tenant.model';
export declare const getTenantConnection: (tenant: ITenant) => mongoose.Connection;
export declare const findTenant: (options: {
    tenantId?: string;
    tenantSlug?: string;
    email?: string;
}) => Promise<(mongoose.Document<unknown, {}, ITenant, {}, {}> & ITenant & {
    _id: Types.ObjectId;
} & {
    __v: number;
}) | null>;
export declare const getDefaultTenant: () => Promise<mongoose.Document<unknown, {}, ITenant, {}, {}> & ITenant & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare const resolveTenant: (options: {
    tenantId?: string;
    tenantSlug?: string;
}) => Promise<(mongoose.Document<unknown, {}, ITenant, {}, {}> & ITenant & {
    _id: Types.ObjectId;
} & {
    __v: number;
}) | null>;
//# sourceMappingURL=tenant.d.ts.map