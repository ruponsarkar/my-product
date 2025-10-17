import swaggerJSDoc from "swagger-jsdoc";
import { OpenAPIV3 } from "openapi-types";

const swaggerDefinition: OpenAPIV3.Document = {
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

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: [
    "./src/routes/*.ts",       // route files
    "./src/controllers/*.ts",  // controller files with @openapi comments,
    "./src/swagger/docs/*.js",    // scan separate docs folder
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
