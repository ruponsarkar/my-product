import { Document, Connection, Model } from "mongoose";
export interface IFormAttributes extends Document {
    name: string;
    label: string;
    type: string;
    cssClass?: string;
    eventKey?: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    options?: string[];
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    order?: number;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const getFormAttributesModel: (conn: Connection, collectionName?: string) => Model<IFormAttributes>;
declare const _default: Model<IFormAttributes, {}, {}, {}, Document<unknown, {}, IFormAttributes, {}, {}> & IFormAttributes & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=form_attritubes.model.d.ts.map