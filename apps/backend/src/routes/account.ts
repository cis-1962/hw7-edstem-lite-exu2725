import express from 'express';
import User from '../models/user';
import requireAuth from '../middlewares/require-auth';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }
  try {
    const existingUser = await User.exists({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const newUser = await User.create({ username, password });
    req.session!.user = username;
    return res
      .status(201)
      .json({ message: 'Signup successful', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session!.user = user.username;
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', requireAuth, (req, res) => {
  req.session = null;
  return res.status(200).json({ message: 'Logout successful' });
});

export default router;
