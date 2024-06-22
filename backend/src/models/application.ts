import mongoose, { Document, Schema } from "mongoose";

// Interface for Application schema
interface IApplication extends Document {
  candidateId: mongoose.Types.ObjectId;
  jobId: string;
  resume: Buffer;
  r1Answers: string[];
  r2Answers: string[];
  createdAt: Date;
}

// Mongoose schema definition
const applicationSchema = new Schema<IApplication>({
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: "Candidate", // Reference to Candidate model if exists
    required: true,
  },
  jobId: {
    type: String,
    required: true,
  },
  resume: {
    type: Buffer,
    required: true,
  },
  r1Answers: {
    type: [String],
    required: true,
  },
  r2Answers: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define and export Application model based on schema
const Application = mongoose.model<IApplication>(
  "Application",
  applicationSchema
);

export default Application;
