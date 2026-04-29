"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger/swagger"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use((0, cors_1.default)({ origin: '*' }));
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // serve uploads folder
app.use('/uploads', (req, res, next) => {
    // allow cross-origin image usage
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // allow the resource to be used cross-origin
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Serve swagger json (optional)
app.get("/swagger.json", (_req, res) => res.json(swagger_1.default));
// Serve interactive UI
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, { explorer: true }));
// API versioning
app.use('/api/v1', routes_1.default);
// Root route
app.get('/', (req, res) => res.send('Hello World!'));
// error handler (last)
// app.use(errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map