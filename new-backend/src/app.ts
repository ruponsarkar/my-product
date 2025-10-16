import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import path from "path";


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // serve uploads folder

// API versioning
app.use('/api/v1', routes);

// Root route
app.get('/', (req, res) => res.send('Hello World!'));

// error handler (last)
// app.use(errorHandler);

export default app;
