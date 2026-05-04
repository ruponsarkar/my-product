import { Document } from 'mongoose';
export interface IAnalytics extends Document {
    name: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
declare const _default: import("mongoose").Model<IAnalytics, {}, {}, {}, Document<unknown, {}, IAnalytics, {}, {}> & IAnalytics & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=analytics.model.d.ts.map