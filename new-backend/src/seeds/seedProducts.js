"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("../models/product.model"));
const slugify_1 = __importDefault(require("slugify"));
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecom';
// Example products
const products = [
    {
        name: 'iPhone 15',
        description: 'Latest Apple iPhone 15 with advanced features.',
        price: 999,
        images: ['https://example.com/iphone15.jpg'],
        brand: 'Apple',
        stock: 50,
        attributes: [{ key: 'Color', value: 'Black' }, { key: 'Storage', value: '256GB' }],
    },
    {
        name: 'Nike Air Max',
        description: 'Comfortable and stylish sneakers.',
        price: 150,
        images: ['https://example.com/nike-airmax.jpg'],
        brand: 'Nike',
        stock: 100,
        attributes: [{ key: 'Size', value: '10' }, { key: 'Color', value: 'Red' }],
    },
    {
        name: 'Harry Potter Book Set',
        description: 'Complete 7-book collection of Harry Potter.',
        price: 120,
        images: ['https://example.com/harrypotter.jpg'],
        brand: 'Bloomsbury',
        stock: 200,
        attributes: [{ key: 'Edition', value: 'Hardcover' }],
    },
];
(async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');
        // Clear existing products
        await product_model_1.default.deleteMany();
        // Add slugs
        const productsWithSlug = products.map(p => ({
            ...p,
            slug: (0, slugify_1.default)(p.name, { lower: true }),
        }));
        // Insert products
        await product_model_1.default.insertMany(productsWithSlug);
        console.log('✅ Products seeded successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeder error:', error);
        process.exit(1);
    }
})();
//# sourceMappingURL=seedProducts.js.map