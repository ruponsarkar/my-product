import { Schema, Types } from "mongoose";
declare const _default: import("mongoose").Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
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
    }>;
    total: number;
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
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
    }>;
    total: number;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
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
    }>;
    total: number;
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
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
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
    }>;
    total: number;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
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
    }>;
    total: number;
}>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
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
    }>;
    total: number;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=order.model.d.ts.map