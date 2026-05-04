import { Schema, Types } from "mongoose";
declare const _default: import("mongoose").Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    discount: number;
    tax: number;
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    order_id: string;
    customer_phone: string;
    payment_type: "cash" | "online" | "credit";
    credit: number;
    items: Types.DocumentArray<{
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }> & {
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    total: number;
    paidAmount: number;
    status: "ordered" | "cash" | "credit" | "paid" | "cancelled" | "completed";
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    discount: number;
    tax: number;
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    order_id: string;
    customer_phone: string;
    payment_type: "cash" | "online" | "credit";
    credit: number;
    items: Types.DocumentArray<{
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }> & {
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    total: number;
    paidAmount: number;
    status: "ordered" | "cash" | "credit" | "paid" | "cancelled" | "completed";
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    discount: number;
    tax: number;
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    order_id: string;
    customer_phone: string;
    payment_type: "cash" | "online" | "credit";
    credit: number;
    items: Types.DocumentArray<{
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }> & {
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    total: number;
    paidAmount: number;
    status: "ordered" | "cash" | "credit" | "paid" | "cancelled" | "completed";
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    discount: number;
    tax: number;
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    order_id: string;
    customer_phone: string;
    payment_type: "cash" | "online" | "credit";
    credit: number;
    items: Types.DocumentArray<{
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }> & {
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    total: number;
    paidAmount: number;
    status: "ordered" | "cash" | "credit" | "paid" | "cancelled" | "completed";
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    discount: number;
    tax: number;
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    order_id: string;
    customer_phone: string;
    payment_type: "cash" | "online" | "credit";
    credit: number;
    items: Types.DocumentArray<{
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }> & {
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    total: number;
    paidAmount: number;
    status: "ordered" | "cash" | "credit" | "paid" | "cancelled" | "completed";
}>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    discount: number;
    tax: number;
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    order_id: string;
    customer_phone: string;
    payment_type: "cash" | "online" | "credit";
    credit: number;
    items: Types.DocumentArray<{
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }> & {
        product: {
            prototype?: Types.ObjectId | null;
            cacheHexString?: unknown;
            generate?: {} | null;
            createFromTime?: {} | null;
            createFromHexString?: {} | null;
            createFromBase64?: {} | null;
            isValid?: {} | null;
        };
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    total: number;
    paidAmount: number;
    status: "ordered" | "cash" | "credit" | "paid" | "cancelled" | "completed";
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=order.model.d.ts.map