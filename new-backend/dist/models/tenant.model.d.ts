import { Document, Connection } from 'mongoose';
export interface ITenant extends Document {
    _id: any;
    tenantId: string;
    name: string;
    slug: string;
    email: string;
    password: string;
    dbName: string;
    settings: Record<string, any>;
    status: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const getTenantModel: (conn: Connection) => unknown;
declare const _default: import("mongoose").Model<ITenant, {}, {}, {}, Document<unknown, {}, ITenant, {}, {}> & ITenant & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=tenant.model.d.ts.map