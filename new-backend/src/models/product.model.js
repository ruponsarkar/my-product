"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true, text: true },
    description: { type: String, text: false },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, unique: true }, // stock keeping unit
    category: { type: String },
    brand: { type: String },
    // Pricing & costs
    costPrice: { type: Number },
    sellingPrice: { type: Number },
    mrp: { type: Number }, // Maximum retail price
    discount: { type: Number }, // percentage discount
    tax: { type: Number }, // percentage tax
    // Stock & inventory
    stockQty: { type: Number, default: 0 },
    reorderLevel: { type: Number }, // when to reorder
    reorderQty: { type: Number }, // quantity to reorder
    // Supplier info
    supplierName: { type: String },
    supplierContact: { type: String },
    // Dates
    purchaseDate: { type: Date },
    expiryDate: { type: Date },
    warranty: { type: Date },
    // Warehouse
    warehouse: { type: String },
    // Flags
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    // Media
    // images: [{ type: String }],
    images: [
        {
            url: { type: String, required: false },
            attributes: [
                {
                    name: { type: String, required: false },
                    value: [{ type: String, required: false }]
                }
            ]
        }
    ],
    // Extra
    // attributes: [{ key: String, value: String }],
    attributes: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {}
    },
    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
}, { timestamps: true });
ProductSchema.index({ name: "text", description: "text" });
exports.default = (0, mongoose_1.model)("Product", ProductSchema);
//# sourceMappingURL=product.model.js.map