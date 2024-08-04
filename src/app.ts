import mongoose from 'mongoose';
import express from 'express';
import * as dotenv from 'dotenv';
import { errors } from 'celebrate';
import helmet from 'helmet';
import router from './routes';
import errorHandler from './middlewares/handle-error';
import authRoutes from './routes/auth';
import authMiddleware from './middlewares/auth';
import logger from './middlewares/logger';
import CONFIG from './config';

dotenv.config();
const app = express();

mongoose.connect(CONFIG.MONGO_URI);
app.use(logger.requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(authRoutes);
app.use(authMiddleware);
app.use(router);
app.use(logger.errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(CONFIG.PORT);
