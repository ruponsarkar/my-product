import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  slug: string;
  sku?: string;
  category?: string;
  brand?: string;

  // Pricing & costs
  costPrice?: number;
  sellingPrice?: number;
  mrp?: number;
  discount?: number;
  tax?: number;

  // Stock & inventory
  stockQty?: number;
  reorderLevel?: number;
  reorderQty?: number;

  // Supplier info
  supplierName?: string;
  supplierContact?: string;

  // Dates
  purchaseDate?: Date;
  expiryDate?: Date;
  warranty?: Date;

  // Warehouse
  warehouse?: string;

  // Flags
  isActive: boolean;
  isFeatured: boolean;

  // Media
  images?: {
    url?: string;
    attributes?: {
      name?: string;
      value?: string[];
    }[];
  }[];

  // Extra attributes
  attributes?: Record<string, any>;

  // Ratings
  ratingsAverage?: number;
  ratingsCount?: number;

  // System fields
  createdAt?: Date;
  updatedAt?: Date;
}

const ImageSchema = new Schema(
  {
    url: { type: String, required: false },
    // store attributes as an object: { color: ['red'], size: ['M','L'] }
    attributes: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false } // optional: prevents separate _id for each image subdoc
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, text: true },
    description: { type: String, text: false },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, unique: true }, // stock keeping unit
    barcode: { type: String },
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
    // images: [
    //   {
    //     url: { type: String, required: false },
    //     attributes: {
    //       type: Schema.Types.Mixed,
    //       default: {},
    //     },

    //     // attributes: [
    //     //   {
    //     //     name: { type: String, required: false },
    //     //     value: [{ type: String, required: false }]
    //     //   }
    //     // ]
    //   },
    // ],

    images: { type: [ImageSchema], default: [] },

    // Extra
    // attributes: [{ key: String, value: String }],
    attributes: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text" });

export default model("Product", ProductSchema);
