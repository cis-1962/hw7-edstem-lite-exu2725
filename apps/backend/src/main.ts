import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';


// read environment variables from .env file
dotenv.config();

const URI = "mongodb+srv://xueric:5oj1RadsPOahobod@hw7.aweg9fu.mongodb.net/?retryWrites=true&w=majority&appName=hw7";

mongoose.connect(URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

const PORT = process.env.PORT ?? 8000;

const app = express();

app.use(express.json());

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'] // Provide an array of secret keys for signing the session cookie
}));

// define root route
app.get('/api/hello', (_, res) => {
  res.json({ message: 'Hello, frontend!' });
});

// listen
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Now listening on port ${PORT}.`);
});

