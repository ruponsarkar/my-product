import { Connection, Model, Document } from "mongoose";
export interface IClient extends Document {
    name: string;
    mobile: string;
    password?: string | null;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    notes?: string;
    totalOrders?: number;
    totalSpent?: number;
    lastOrderAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const getClientModel: (conn: Connection, collectionName?: string) => Model<IClient>;
declare const _default: Model<IClient, {}, {}, {}, Document<unknown, {}, IClient, {}, {}> & IClient & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=client.model.d.ts.map