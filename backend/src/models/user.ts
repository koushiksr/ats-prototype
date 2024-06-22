import { Schema, model, Document } from "mongoose";

export enum Roles {
  Candidate = "Candidate",
  Coordinator = "Coordinator",
  Recruiter = "Recruiter",
  Employer = "Employer",
}

export interface IUser extends Document {
  username: string;
  email: string;
  role: Roles;
  password: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: Object.values(Roles), required: true },
  password: { type: String, required: true },
});

export const User = model<IUser>("User", userSchema);
