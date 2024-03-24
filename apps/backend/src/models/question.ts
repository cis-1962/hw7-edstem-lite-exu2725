import mongoose, { Schema, Document } from 'mongoose';

interface IQuestion extends Document {
  questionText: string;
  answer: string;
  author: string;
}

const questionSchema: Schema = new Schema({
  questionText: { type: String, required: true },
  answer: { type: String },
  author: { type: String, required: true },
});

const Question = mongoose.model<IQuestion>('Question', questionSchema);

export default Question;
