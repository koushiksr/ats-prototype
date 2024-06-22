import { Request, Response } from "express";
import { User } from "../models/user";
import { Job } from "../models/job";
import { Application } from "../models/application";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

export const registerCandidate = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newCandidate = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    await newCandidate.save();
    res.status(201).json({ message: "Candidate registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering candidate" });
  }
};

export const getJobPosts = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job posts" });
  }
};

export const applyForJob = [
  upload.single("resume"),
  async (req: Request, res: Response) => {
    const { candidateId, jobId, r1Answers, r2Answers } = req.body;
    const resume = req.file?.path;
    try {
      const newApplication = new Application({
        candidateId,
        jobId,
        resume,
        r1Answers: JSON.parse(r1Answers),
        r2Answers: JSON.parse(r2Answers),
      });
      await newApplication.save();
      res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error submitting application" });
    }
  },
];
