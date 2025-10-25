import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors({ origin: '*' }));

// app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // serve uploads folder
app.use('/uploads', (req, res, next) => {
    // allow cross-origin image usage
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // allow the resource to be used cross-origin
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  }, express.static(path.join(process.cwd(), 'uploads')));
  

// Serve swagger json (optional)
app.get("/swagger.json", (_req, res) => res.json(swaggerSpec));
// Serve interactive UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));



// API versioning
app.use('/api/v1', routes);

// Root route
app.get('/', (req, res) => res.send('Hello World!'));

// error handler (last)
// app.use(errorHandler);

export default app;
