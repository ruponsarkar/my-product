import { Request, Response, RequestHandler } from "express";
import Product, { IProduct } from "../models/product.model";
import { FilterQuery } from "mongoose";
import slugify from "slugify";

import path from "path";
import fs from "fs";


const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const PUBLIC_PREFIX = "/uploads";
const publicPath = (filename: string) => `${PUBLIC_PREFIX}/${filename}`;

const removeFile = (filename: string) => {
  try {
    const fp = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  } catch (e) {
    console.error("removeFile error:", e);
  }
};

type MulterFile = Express.Multer.File;

/**
 * Parse attributes payload into an array aligned with files array.
 * raw may be:
 *  - object keyed by filename -> { "photo.jpg": { color: ['red'] }, ... }
 *  - array matching files order -> [ { color: [...] }, { ... } ]
 *  - single object -> apply to all files (not recommended)
 */
function buildAttributesPerFile(raw: any, files: MulterFile[]): (Record<string, string[]>)[] {
  const empty = () => ({});
  if (!raw) return files.map(empty);

  let parsed: any = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      // invalid JSON -> treat as none
      return files.map(empty);
    }
  }

  // If object keyed by filename
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return files.map((f) => {
      // prefer originalname, then filename (Multer generated)
      const key = parsed[f.originalname] ?? parsed[f.filename];
      return (key && typeof key === "object") ? key : {};
    });
  }

  // If it's an array matching files length
  if (Array.isArray(parsed) && parsed.length === files.length) {
    return parsed.map((p) => (p && typeof p === "object" ? p : {}));
  }

  // If parsed is an object but not keyed by filename, apply same to all
  if (parsed && typeof parsed === "object") {
    return files.map(() => parsed);
  }

  return files.map(empty);
}

export const addProductImages: RequestHandler = async (req, res) => {
  const files = Array.isArray((req as any).files) ? ((req as any).files as MulterFile[]) : [];

  try {
    const { id } = req.params;
    if (!files.length) return res.status(400).json({ message: "No images uploaded" });

    // parse attributes provided in form-data field "attributes"
    const rawAttributes = req.body?.attributes;
    const attributesPerFile = buildAttributesPerFile(rawAttributes, files);

    // build image subdocuments
    const subdocs = files.map((f, i) => {
      const attrs = attributesPerFile[i] ?? {};
      // ensure every value is an array of strings
      const normalized: Record<string, string[]> = {};
      Object.entries(attrs).forEach(([k, v]) => {
        if (Array.isArray(v)) normalized[k] = v.map(String);
        else if (v != null) normalized[k] = [String(v)];
        else normalized[k] = [];
      });

      return {
        url: publicPath(f.filename),
        attributes: normalized,
      };
    });

    // ensure product exists
    const product = await Product.findById(id);
    if (!product) {
      files.forEach((f) => removeFile(f.filename));
      return res.status(404).json({ message: "Product not found" });
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { $push: { images: { $each: subdocs } } },
      { new: true }
    ).lean();

    return res.status(200).json({ message: "Images uploaded", product: updated });
  } catch (err: any) {
    console.error("addProductImages error:", err);

    // cleanup uploaded files on error
    if (Array.isArray((req as any).files)) {
      (req as any).files.forEach((f: MulterFile) => {
        if (f?.filename) removeFile(f.filename);
      });
    }

    return res.status(500).json({ message: "Internal server error", error: err?.message });
  }
};




















// ======================================================================

// old codes 
// export const getProducts = async (req: Request, res: Response) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// };

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const sortBy =
      typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    // keep filter as plain object to avoid TS inference explosion
    const filter: any = {};

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");

      // keep $or as plain any[] to avoid huge union types
      const orFilters: any[] = [
        { name: regex },
        { sku: regex },
        { category: regex },
      ];

      filter.$or = orFilters;
    }

    // example: add category filter if provided
    if (req.query.category) {
      filter.category = String(req.query.category);
    }

    // run queries (split to avoid type inference issues in Promise.all)
    const total = await Product.countDocuments(filter as any).exec();

    const data = await Product.find(filter as any)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const pages = Math.max(1, Math.ceil(total / limit));
    return res.json({ data, total, page, pages, limit });
  } catch (err) {
    console.error("getProducts error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// export const getProductById = async (req: Request, res: Response) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Not found" });
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// };

export const getProductByIdOrSlug = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing ID or slug" });
    }

    // Ensure id is treated as string for the regex test
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(String(id));

    const product = isObjectId
      ? await Product.findById(id)
      : await Product.findOne({ slug: id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const saveProduct = async (req: Request, res: Response) => {
  try {
    // base slug
    let baseSlug = slugify(req.body.name, { lower: true, strict: true });
    let slug = baseSlug;

    // check if slug exists
    let count = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const data = { slug, ...req.body };
    const product = new Product(data);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

