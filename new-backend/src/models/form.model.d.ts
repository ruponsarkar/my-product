import { Document, Types } from "mongoose";
export interface IForm extends Document {
    formName: string;
    formFor?: string;
    description?: string;
    createdBy: Types.ObjectId;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
declare const _default: import("mongoose").Model<IForm, {}, {}, {}, Document<unknown, {}, IForm, {}, {}> & IForm & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=form.model.d.ts.map