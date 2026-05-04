import { Document } from 'mongoose';
export interface IUser extends Document {
    _id: any;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'seller';
    comparePassword(candidate: string): Promise<boolean>;
}
declare const _default: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=user.model.d.ts.map