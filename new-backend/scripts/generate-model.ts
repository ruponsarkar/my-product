#!/usr/bin/env ts-node

import fs from "fs";
import path from "path";

// ================== Helpers ==================
function pascalCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const args = process.argv.slice(2);
const name = args[0]; // e.g. Product
const createController = args.includes("-c");
const createRoute = args.includes("-r");

console.log("args ", args);

// console.log(createController, createRoute);


if (!name) {
  console.error("❌ Please provide a resource name");
  process.exit(1);
}

const modelName = pascalCase(name);
const lowerName = name.toLowerCase();

// ================== Model ==================
const modelTemplate = `import { Schema, model, Document } from 'mongoose';

export interface I${modelName} extends Document {
  // Define fields here
  name: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ${modelName}Schema = new Schema<I${modelName}>(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // 👈 soft delete flag
  },
  { timestamps: true }
);

export default model<I${modelName}>('${modelName}', ${modelName}Schema);
`;

const modelPath = path.join(process.cwd(), "src", "models", `${lowerName}.model.ts`);
fs.mkdirSync(path.dirname(modelPath), { recursive: true });

if (fs.existsSync(modelPath)) {
  console.error(`⚠️ Model already exists: src/models/${lowerName}.model.ts`);
} else {
  fs.writeFileSync(modelPath, modelTemplate);
  console.log(`✅ Model created: src/models/${lowerName}.model.ts`);
}

// ================== Controller ==================
if (createController) {
  const controllerPath = path.join(process.cwd(), "src", "controllers", `${lowerName}.controller.ts`);

  const controllerTemplate = `import { Request, Response } from 'express';
import ${modelName} from '../models/${lowerName}.model';

export const getAll${modelName}s = async (req: Request, res: Response) => {
  const data = await ${modelName}.find();
  res.json(data);
};

export const create${modelName} = async (req: Request, res: Response) => {
  const item = new ${modelName}(req.body);
  await item.save();
  res.status(201).json(item);
};
`;

  fs.mkdirSync(path.dirname(controllerPath), { recursive: true });

  if (fs.existsSync(controllerPath)) {
    console.error(`⚠️ Controller already exists: src/controllers/${lowerName}.controller.ts`);
  } else {
    fs.writeFileSync(controllerPath, controllerTemplate);
    console.log(`✅ Controller created: src/controllers/${lowerName}.controller.ts`);
  }
}

// ================== Route ==================
if (createRoute) {
  const routePath = path.join(process.cwd(), "src", "routes", `${lowerName}.routes.ts`);

  const routeTemplate = `import { Router } from 'express';
import { getAll${modelName}s, create${modelName} } from '../controllers/${lowerName}.controller';

const router = Router();

router.get('/', getAll${modelName}s);
router.post('/', create${modelName});

export default router;
`;

  fs.mkdirSync(path.dirname(routePath), { recursive: true });

  if (fs.existsSync(routePath)) {
    console.error(`⚠️ Route already exists: src/routes/${lowerName}.routes.ts`);
  } else {
    fs.writeFileSync(routePath, routeTemplate);
    console.log(`✅ Route created: src/routes/${lowerName}.routes.ts`);
  }

  // ================== Auto-update routes/index.ts ==================
  const routesIndexPath = path.join(process.cwd(), "src", "routes", "index.ts");
  if (fs.existsSync(routesIndexPath)) {
    let content = fs.readFileSync(routesIndexPath, "utf-8");

    const importLine = `import ${lowerName}Routes from './${lowerName}.routes';`;
    const useLine = `router.use('/${lowerName}s', ${lowerName}Routes);`;

    if (!content.includes(importLine)) {
      content = importLine + "\n" + content;
    }
    if (!content.includes(useLine)) {
      content += `\n${useLine}\n`;
    }

    fs.writeFileSync(routesIndexPath, content);
    console.log(`🔗 Auto-registered route in routes/index.ts -> /${lowerName}s`);
  } else {
    console.error("⚠️ routes/index.ts not found. Skipping auto-registration.");
  }
}
