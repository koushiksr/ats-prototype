import { Request, Response } from "express";
import {
  createJobService,
  getAllJobsService,
  assignRecruitersService,
  addR2QuestionsService,
  getResponsesService,
  getAllJobsNotAssignedService,
  getAllJobsAssignedService,
  getCandidatesByJobId,
} from "../services/job"; // Import the Job service
import { IJob } from "../models/job"; // Import the Job model interface

export async function createJob(req: Request, res: Response): Promise<void> {
  try {
    const { jobTitle, location, salary, responsibilities, r1Questions } =
      req.body;

    // Validate input
    if (
      !jobTitle ||
      !location ||
      !salary ||
      !responsibilities ||
      !r1Questions
    ) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Assuming r1Questions is an array of objects with required properties
    if (
      !Array.isArray(r1Questions) ||
      r1Questions.some(
        (q) =>
          !q.question ||
          q.options.length !== 4 ||
          typeof q.correctIndex !== "number"
      )
    ) {
      res.status(400).json({ error: "Invalid R1 questions format" });
      return;
    }

    const jobData: IJob = {
      jobTitle,
      location,
      salary,
      responsibilities,
      r1Questions,
    };

    const job = await createJobService(jobData);

    res.status(201).json(job); // Send the newly created job as JSON response
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Error creating job." });
  }
}

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await getAllJobsService();
    res.json(jobs);
  } catch (error) {
    res.status(500).send("Server error");
  }
};
export const getRecJobApplies = async (req: Request, res: Response) => {
  try {
    const jobs = await getCandidatesByJobId(req.params.id);
    res.json(jobs);
  } catch (error) {
    res.status(500).send("Server error");
  }
};
export const getAllJobsNotAssigned = async (req: Request, res: Response) => {
  try {
    const jobs = await getAllJobsNotAssignedService();
    res.json(jobs);
  } catch (error) {
    res.status(500).send("Server error");
  }
};
export const getAllJobsAssigned = async (req: Request, res: Response) => {
  try {
    const jobs = await getAllJobsAssignedService();
    res.json(jobs);
  } catch (error) {
    res.status(500).send("Server error");
  }
};
export const assignRecruiters = async (req: Request, res: Response) => {
  const { recruiters } = req.body;
  try {
    await assignRecruitersService(req.params.id, recruiters);
    res.send("Recruiters assigned");
  } catch (error) {
    if (error.message === "Job not found") {
      res.status(404).send(error.message);
    } else {
      res.status(500).send("Server error");
    }
  }
};

export const addR2Questions = async (req: Request, res: Response) => {
  const { r2Questions } = req.body;
  try {
    await addR2QuestionsService(req.params.id, r2Questions);
    res.send("R2 questions added");
  } catch (error) {
    if (error.message === "Job not found") {
      res.status(404).send(error.message);
    } else {
      res.status(500).send("Server error");
    }
  }
};

export const getResponses = async (req: Request, res: Response) => {
  try {
    const responses = await getResponsesService(req.params.id);
    res.json(responses);
  } catch (error) {
    res.status(500).send("Server error");
  }
};
