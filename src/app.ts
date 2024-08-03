import mongoose from 'mongoose';
import express, { Response, NextFunction } from 'express';
import router from './routes';
import errorHandler from './middlewares/handle-error';
import { RequestWithUser } from './controllers/users';

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

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

app.listen(PORT);
