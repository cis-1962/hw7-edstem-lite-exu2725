import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import router from './routes/account';
import questionRouter from './routes/questions';

// read environment variables from .env file
dotenv.config();

const URI = process.env.MONGODB_URI || 'default';
mongoose
  .connect(URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', URI, err));

const PORT = process.env.PORT ?? 8000;
const SECRET = process.env.SECRET ?? 'secret';

const app = express();

app.use(express.json());

app.use(cors());

app.use(
  cookieSession({
    name: 'session',
    secret: SECRET,
  }),
);

// define root route
app.get('/api/hello', (_, res) => {
  res.json({ message: 'Hello, frontend!' });
});

app.use((req, res, next) => {
  //console.log(req.session);
  next();
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('An error occurred:', err);
  res.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);
app.use('/api/account', router);
app.use('/api/questions', questionRouter);

// listen
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Now listening on port ${PORT}.`);
});
