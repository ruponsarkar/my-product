import { Schema, Types, Connection, Model } from "mongoose";
export declare const getOrderModel: (conn: Connection, collectionName?: string) => Model<any>;
declare const _default: Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "ordered" | "cash" | "online" | "credit" | "paid" | "cancelled" | "completed";
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    discount: number;
    tax: number;
    client: {
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
    customer_name: string;
    customer_email: string;
    customer_note: string;
    payment_type: "cash" | "online" | "credit";
    credit: number;
    order_from: "POS" | "WEB" | "APP";
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
    delivery_address?: {
        addressLine1: string;
        addressLine2: string;
        city: string;
    } | null;
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "ordered" | "cash" | "online" | "credit" | "paid" | "cancelled" | "completed";
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    discount: number;
    tax: number;
    client: {
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
    customer_name: string;
    customer_email: string;
    customer_note: string;
    payment_type: "cash" | "online" | "credit";
    credit: number;
    order_from: "POS" | "WEB" | "APP";
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
    delivery_address?: {
        addressLine1: string;
        addressLine2: string;
        city: string;
    } | null;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "ordered" | "cash" | "online" | "credit" | "paid" | "cancelled" | "completed";
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    discount: number;
    tax: number;
    client: {
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
    customer_name: string;
    customer_email: string;
    customer_note: string;
    payment_type: "cash" | "online" | "credit";
    credit: number;
    order_from: "POS" | "WEB" | "APP";
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
    delivery_address?: {
        addressLine1: string;
        addressLine2: string;
        city: string;
    } | null;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "ordered" | "cash" | "online" | "credit" | "paid" | "cancelled" | "completed";
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    discount: number;
    tax: number;
    client: {
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
    customer_name: string;
    customer_email: string;
    customer_note: string;
    payment_type: "cash" | "online" | "credit";
    credit: number;
    order_from: "POS" | "WEB" | "APP";
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
    delivery_address?: {
        addressLine1: string;
        addressLine2: string;
        city: string;
    } | null;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "ordered" | "cash" | "online" | "credit" | "paid" | "cancelled" | "completed";
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    discount: number;
    tax: number;
    client: {
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
    customer_name: string;
    customer_email: string;
    customer_note: string;
    payment_type: "cash" | "online" | "credit";
    credit: number;
    order_from: "POS" | "WEB" | "APP";
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
    delivery_address?: {
        addressLine1: string;
        addressLine2: string;
        city: string;
    } | null;
}>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "ordered" | "cash" | "online" | "credit" | "paid" | "cancelled" | "completed";
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    discount: number;
    tax: number;
    client: {
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
    customer_name: string;
    customer_email: string;
    customer_note: string;
    payment_type: "cash" | "online" | "credit";
    credit: number;
    order_from: "POS" | "WEB" | "APP";
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
    delivery_address?: {
        addressLine1: string;
        addressLine2: string;
        city: string;
    } | null;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=order.model.d.ts.map