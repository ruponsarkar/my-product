import { Document, Connection, Model } from 'mongoose';
export interface IUser extends Document {
    _id: any;
    name: string;
    email: string;
    password: string;
    role: string;
    permissions?: string[];
    isActive: boolean;
    comparePassword(candidate: string): Promise<boolean>;
}
export declare const getUserModel: (conn: Connection, collectionName?: string) => Model<IUser>;
declare const _default: Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=user.model.d.ts.map