"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProductImages = exports.updateProduct = exports.saveProduct = exports.getProductById = exports.getProducts = exports.publicPath = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const slugify_1 = __importDefault(require("slugify"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Convert stored filename -> public URL/path used in DB.
 * Adjust this to match how you serve the uploads folder (static route).
 * Example: if you serve uploads with `app.use('/uploads', express.static('uploads'))`
 * then publicPath('abc.jpg') -> `/uploads/abc.jpg`
 */
const publicPath = (filename) => `/uploads/${filename}`;
exports.publicPath = publicPath;
// export const getProducts = async (req: Request, res: Response) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// };
function escapeRegex(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const getProducts = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
        const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
        const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
        const skip = (page - 1) * limit;
        // keep filter as plain object to avoid TS inference explosion
        const filter = {};
        if (search) {
            const regex = new RegExp(escapeRegex(search), "i");
            // keep $or as plain any[] to avoid huge union types
            const orFilters = [
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
        const total = await product_model_1.default.countDocuments(filter).exec();
        const data = await product_model_1.default.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();
        const pages = Math.max(1, Math.ceil(total / limit));
        return res.json({ data, total, page, pages, limit });
    }
    catch (err) {
        console.error("getProducts error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const product = await product_model_1.default.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Not found" });
        res.json(product);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.getProductById = getProductById;
const saveProduct = async (req, res) => {
    try {
        // base slug
        let baseSlug = (0, slugify_1.default)(req.body.name, { lower: true, strict: true });
        let slug = baseSlug;
        // check if slug exists
        let count = 1;
        while (await product_model_1.default.findOne({ slug })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }
        const data = { slug, ...req.body };
        const product = new product_model_1.default(data);
        await product.save();
        res.status(201).json(product);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.saveProduct = saveProduct;
const updateProduct = async (req, res) => {
    try {
        const product = await product_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!product)
            return res.status(404).json({ message: "Not found" });
        res.json(product);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.updateProduct = updateProduct;
/**
 * Remove a file from disk (helper used on error cleanup)
 */
const removeFile = (filename) => {
    try {
        const filePath = path_1.default.join(process.cwd(), "uploads", filename);
        if (fs_1.default.existsSync(filePath))
            fs_1.default.unlinkSync(filePath);
    }
    catch (err) {
        // ignore cleanup errors
        console.error("Failed to remove file during cleanup:", err);
    }
};
/**
 * Controller: addProductImages
 * Route example:
 *   router.post('/products/:id/images', uploadMany.array('images', 10), addProductImages);
 */
const addProductImages = async (req, res) => {
    // cast only where needed
    const mreq = req;
    try {
        const { id } = req.params;
        const files = Array.isArray(req.files) ? req.files : [];
        console.log("files : ", files);
        console.log("id : ", id);
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No images uploaded" });
        }
        // Map multer file objects to public paths and store filenames separately for potential cleanup
        const filenames = files.map((f) => f.filename);
        const imagePaths = filenames.map(exports.publicPath);
        // Ensure product exists
        const product = await product_model_1.default.findById(id);
        if (!product) {
            // cleanup files we just stored
            filenames.forEach(removeFile);
            return res.status(404).json({ message: "Product not found" });
        }
        // Update product by pushing new images (use $each so we can push multiple)
        const updated = await product_model_1.default.findByIdAndUpdate(id, { $push: { images: { $each: imagePaths } } }, { new: true } // return the updated document
        ).lean();
        return res
            .status(200)
            .json({ message: "Images uploaded", product: updated });
    }
    catch (err) {
        console.error("addProductImages error:", err);
        // If multer stored files on disk but we hit an error, try to remove them.
        // req.files may be an array or object; handle common case array.
        if (Array.isArray(req.files)) {
            req.files.forEach((f) => {
                if (f && f.filename)
                    removeFile(f.filename);
            });
        }
        // Multer errors are typically instanceof multer.MulterError, but here we generalize
        if (err && err.name === "MulterError") {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.addProductImages = addProductImages;
//# sourceMappingURL=product.controller.js.map