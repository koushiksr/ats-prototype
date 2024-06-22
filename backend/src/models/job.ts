import mongoose, { Schema, Document } from "mongoose";

interface IR1Question {
  question: string;
  options: string[];
  correctIndex: number; // Index for the correct option, 0-based
}

export interface IJob extends Document {
  jobTitle: string;
  location: string;
  salary: number;
  responsibilities: string;
  recruiters: string[];
  r1Questions: IR1Question[];
}

const R1QuestionSchema = new Schema<IR1Question>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true },
});

const JobSchema = new Schema<IJob>({
  jobTitle: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  responsibilities: { type: String, required: true },
  recruiters: { type: [String] },
  r1Questions: [R1QuestionSchema],
});

const Job = mongoose.model<IJob>("Job", JobSchema);

export { Job, IJob };
