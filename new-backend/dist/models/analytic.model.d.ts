import { Document } from 'mongoose';
export interface IAnalytic extends Document {
    name: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
declare const _default: import("mongoose").Model<IAnalytic, {}, {}, {}, Document<unknown, {}, IAnalytic, {}, {}> & IAnalytic & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=analytic.model.d.ts.map