"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB(uri = process.env.MONGO_URI) {
    if (!uri)
        throw new Error('MONGO_URI not set');
    await mongoose_1.default.connect(uri, {
    // recommended options are default in newer mongoose versions
    });
    console.log('MongoDB connected');
}
//# sourceMappingURL=db.js.map