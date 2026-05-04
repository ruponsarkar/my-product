import { Document } from "mongoose";
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
declare const _default: import("mongoose").Model<IFormAttributes, {}, {}, {}, Document<unknown, {}, IFormAttributes, {}, {}> & IFormAttributes & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=form_attritubes.model.d.ts.map