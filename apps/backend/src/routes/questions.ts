import express from 'express';
import Question from '../models/question';
import requireAuth from '../middlewares/require-auth';

const questionRouter = express.Router();

questionRouter.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    return res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

questionRouter.post('/add', requireAuth, async (req, res) => {
  const { questionText } = req.body;
  if (!questionText) {
    return res.status(400).json({ error: 'Question text is required' });
  }
  try {
    //console.log("Here!!!!")
    const newQuestion = await Question.create({
      questionText,
      author: req.session!.user,
    });
    return res
      .status(201)
      .json({ message: 'Question added successfully', question: newQuestion });
  } catch (error) {
    console.error('Error adding question:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

questionRouter.post('/answer', requireAuth, async (req, res) => {
  const { _id, answer } = req.body;
  if (!_id || !answer) {
    return res.status(400).json({ error: '_id and answer are required' });
  }
  try {
    const question = await Question.findById(_id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    question.answer = answer;
    await question.save();
    return res
      .status(200)
      .json({ message: 'Answer added/updated successfully' });
  } catch (error) {
    console.error('Error adding/updating answer:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default questionRouter;
