import { Schema, Document } from "mongoose";
export interface IProduct extends Document {
    name: string;
    description?: string;
    slug: string;
    sku?: string;
    category?: string;
    brand?: string;
    costPrice?: number;
    sellingPrice?: number;
    mrp?: number;
    discount?: number;
    tax?: number;
    stockQty?: number;
    reorderLevel?: number;
    reorderQty?: number;
    supplierName?: string;
    supplierContact?: string;
    purchaseDate?: Date;
    expiryDate?: Date;
    warranty?: Date;
    warehouse?: string;
    isActive: boolean;
    isFeatured: boolean;
    images?: {
        url?: string;
        attributes?: {
            name?: string;
            value?: string[];
        }[];
    }[];
    attributes?: Record<string, any>;
    ratingsAverage?: number;
    ratingsCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
declare const _default: import("mongoose").Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    isActive: boolean;
    slug: string;
    stockQty: number;
    isFeatured: boolean;
    images: import("mongoose").Types.DocumentArray<{
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }> & {
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }>;
    attributes: any;
    ratingsAverage: number;
    ratingsCount: number;
    description?: string | null;
    sku?: string | null;
    category?: string | null;
    brand?: string | null;
    costPrice?: number | null;
    sellingPrice?: number | null;
    mrp?: number | null;
    discount?: number | null;
    tax?: number | null;
    reorderLevel?: number | null;
    reorderQty?: number | null;
    supplierName?: string | null;
    supplierContact?: string | null;
    purchaseDate?: NativeDate | null;
    expiryDate?: NativeDate | null;
    warranty?: NativeDate | null;
    warehouse?: string | null;
}, {}, {}, {}, Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    isActive: boolean;
    slug: string;
    stockQty: number;
    isFeatured: boolean;
    images: import("mongoose").Types.DocumentArray<{
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }> & {
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }>;
    attributes: any;
    ratingsAverage: number;
    ratingsCount: number;
    description?: string | null;
    sku?: string | null;
    category?: string | null;
    brand?: string | null;
    costPrice?: number | null;
    sellingPrice?: number | null;
    mrp?: number | null;
    discount?: number | null;
    tax?: number | null;
    reorderLevel?: number | null;
    reorderQty?: number | null;
    supplierName?: string | null;
    supplierContact?: string | null;
    purchaseDate?: NativeDate | null;
    expiryDate?: NativeDate | null;
    warranty?: NativeDate | null;
    warehouse?: string | null;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    isActive: boolean;
    slug: string;
    stockQty: number;
    isFeatured: boolean;
    images: import("mongoose").Types.DocumentArray<{
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }> & {
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }>;
    attributes: any;
    ratingsAverage: number;
    ratingsCount: number;
    description?: string | null;
    sku?: string | null;
    category?: string | null;
    brand?: string | null;
    costPrice?: number | null;
    sellingPrice?: number | null;
    mrp?: number | null;
    discount?: number | null;
    tax?: number | null;
    reorderLevel?: number | null;
    reorderQty?: number | null;
    supplierName?: string | null;
    supplierContact?: string | null;
    purchaseDate?: NativeDate | null;
    expiryDate?: NativeDate | null;
    warranty?: NativeDate | null;
    warehouse?: string | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    isActive: boolean;
    slug: string;
    stockQty: number;
    isFeatured: boolean;
    images: import("mongoose").Types.DocumentArray<{
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }> & {
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }>;
    attributes: any;
    ratingsAverage: number;
    ratingsCount: number;
    description?: string | null;
    sku?: string | null;
    category?: string | null;
    brand?: string | null;
    costPrice?: number | null;
    sellingPrice?: number | null;
    mrp?: number | null;
    discount?: number | null;
    tax?: number | null;
    reorderLevel?: number | null;
    reorderQty?: number | null;
    supplierName?: string | null;
    supplierContact?: string | null;
    purchaseDate?: NativeDate | null;
    expiryDate?: NativeDate | null;
    warranty?: NativeDate | null;
    warehouse?: string | null;
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    isActive: boolean;
    slug: string;
    stockQty: number;
    isFeatured: boolean;
    images: import("mongoose").Types.DocumentArray<{
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }> & {
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }>;
    attributes: any;
    ratingsAverage: number;
    ratingsCount: number;
    description?: string | null;
    sku?: string | null;
    category?: string | null;
    brand?: string | null;
    costPrice?: number | null;
    sellingPrice?: number | null;
    mrp?: number | null;
    discount?: number | null;
    tax?: number | null;
    reorderLevel?: number | null;
    reorderQty?: number | null;
    supplierName?: string | null;
    supplierContact?: string | null;
    purchaseDate?: NativeDate | null;
    expiryDate?: NativeDate | null;
    warranty?: NativeDate | null;
    warehouse?: string | null;
}>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    isActive: boolean;
    slug: string;
    stockQty: number;
    isFeatured: boolean;
    images: import("mongoose").Types.DocumentArray<{
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }> & {
        attributes: import("mongoose").Types.DocumentArray<{
            value: string[];
            name?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            value: string[];
            name?: string | null;
        }> & {
            value: string[];
            name?: string | null;
        }>;
        url?: string | null;
    }>;
    attributes: any;
    ratingsAverage: number;
    ratingsCount: number;
    description?: string | null;
    sku?: string | null;
    category?: string | null;
    brand?: string | null;
    costPrice?: number | null;
    sellingPrice?: number | null;
    mrp?: number | null;
    discount?: number | null;
    tax?: number | null;
    reorderLevel?: number | null;
    reorderQty?: number | null;
    supplierName?: string | null;
    supplierContact?: string | null;
    purchaseDate?: NativeDate | null;
    expiryDate?: NativeDate | null;
    warranty?: NativeDate | null;
    warehouse?: string | null;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=product.model.d.ts.map