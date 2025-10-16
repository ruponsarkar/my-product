#!/usr/bin/env ts-node

import fs from "fs";
import path from "path";

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

const filePath = path.join(process.cwd(), "src", "models", fileName);

// Ensure folder exists
fs.mkdirSync(path.dirname(filePath), { recursive: true });

// Check if file already exists
if (fs.existsSync(filePath)) {
  console.error(`⚠️ File already exists: src/models/${fileName}`);
  process.exit(1);
}

// Write file
fs.writeFileSync(filePath, template);

console.log(`✅ Model created: src/models/${fileName}`);
