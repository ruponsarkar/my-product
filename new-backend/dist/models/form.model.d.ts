import { Document, Types, Connection, Model } from "mongoose";
export interface IForm extends Document {
    formName: string;
    formFor?: string;
    description?: string;
    createdBy: Types.ObjectId;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const getFormModel: (conn: Connection, collectionName?: string) => Model<IForm>;
declare const _default: Model<IForm, {}, {}, {}, Document<unknown, {}, IForm, {}, {}> & IForm & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=form.model.d.ts.map