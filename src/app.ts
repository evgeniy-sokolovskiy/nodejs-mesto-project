import mongoose from 'mongoose';
import express, { Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import router from './routes';
import errorHandler from './middlewares/handle-error';
import { RequestWithUser } from './controllers/users';
import CONFIG from './config';

dotenv.config();
const app = express();

mongoose.connect(CONFIG.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: RequestWithUser, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66a799e01158f03203b9a1a6',
  };

  next();
});
app.use(router);

app.use(errorHandler);

app.listen(CONFIG.PORT);
