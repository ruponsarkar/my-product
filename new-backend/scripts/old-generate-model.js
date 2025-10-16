#!/usr/bin/env ts-node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const name = process.argv[2]; // e.g. `User`
if (!name) {
    console.error("❌ Please provide a model name");
    process.exit(1);
}
const modelName = name.charAt(0).toUpperCase() + name.slice(1);
const fileName = `${name.toLowerCase()}.model.ts`;
const template = `import { Schema, model, Document } from 'mongoose';

export interface I${modelName} extends Document {
  // Define fields here
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ${modelName}Schema = new Schema<I${modelName}>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<I${modelName}>('${modelName}', ${modelName}Schema);
`;
const filePath = path_1.default.join(process.cwd(), "src", "models", fileName);
// Ensure folder exists
fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
// Check if file already exists
if (fs_1.default.existsSync(filePath)) {
    console.error(`⚠️ File already exists: src/models/${fileName}`);
    process.exit(1);
}
// Write file
fs_1.default.writeFileSync(filePath, template);
console.log(`✅ Model created: src/models/${fileName}`);
//# sourceMappingURL=old-generate-model.js.map