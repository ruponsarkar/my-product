"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: "3.0.3",
    info: {
        title: "My E-Com API",
        version: "1.0.0",
        description: "API docs for the E-com backend",
    },
    servers: [{ url: "http://localhost:4000/api/v1", description: "Local server" }],
    paths: {}, // required
    components: {
        securitySchemes: {
            BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
    },
    security: [{ BearerAuth: [] }],
};
const options = {
    swaggerDefinition,
    apis: [
        "./src/routes/*.ts", // route files
        "./src/controllers/*.ts", // controller files with @openapi comments,
        "./src/swagger/docs/*.js", // scan separate docs folder
    ],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map