import { Document, Connection, Model } from 'mongoose';
export interface IAnalytic extends Document {
    name: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const getAnalyticModel: (conn: Connection, collectionName?: string) => Model<IAnalytic>;
declare const _default: Model<IAnalytic, {}, {}, {}, Document<unknown, {}, IAnalytic, {}, {}> & IAnalytic & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=analytic.model.d.ts.map