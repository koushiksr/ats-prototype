import mongoose, { Document, Schema, Model } from "mongoose";

interface IResponse extends Document {
  jobId: mongoose.Types.ObjectId;
  r1Responses: {
    question: string;
    answer: string;
  }[];
  r2Responses: {
    question: string;
    answer: string;
  }[];
  candidateId: mongoose.Types.ObjectId;
  submittedAt: Date;
}

const responseSchema: Schema<IResponse> = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  r1Responses: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  r2Responses: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Response: Model<IResponse> = mongoose.model<IResponse>(
  "Response",
  responseSchema
);

export { Response, IResponse };
