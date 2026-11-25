import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from './config/cors.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

// Trust first proxy (needed for rate limiting & secure cookies behind Hostinger/reverse proxies)
app.set('trust proxy', 1);

// Core security & request-parsing middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: true, limit: '256kb' }));
app.use(cookieParser());

// API routes
app.use('/api', apiRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
