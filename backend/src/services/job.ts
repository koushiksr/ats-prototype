// services/jobService.ts

import app from "../app";
import Application from "../models/application";
import { IJob, Job } from "../models/job"; // Import the job model
import { Response } from "../models/response";
import { User } from "../models/user";

export async function createJobService(jobData: IJob): Promise<IJob> {
  try {
    const newJob = new Job(jobData); // Create a new Job instance with the provided data
    return await newJob.save(); // Save the new job to the database
  } catch (error) {
    throw new Error("Error creating job: " + error.message); // Handle errors and throw custom error
  }
}

export const getAllJobsService = async () => {
  return await Job.find();
};
export const getAllJobsNotAssignedService = async () => {
  try {
    console.log("first");
    return await Job.find({ recruiters: { $exists: true, $eq: [] } });
  } catch (error) {
    console.error("Error fetching jobs not assigned:", error);
    throw new Error(
      "Failed to fetch jobs not assigned. Please try again later."
    );
  }
};
export const getCandidatesByJobId = async (jobId) => {
  try {
    // Find applications where jobId matches
    const applications = await Application.find({ jobId: jobId });

    // Extract candidateIds from applications
    const candidateIds = applications.map((app) => app.candidateId);

    // Find candidates using candidateIds and populate additional fields
    const candidates = await User.find({ _id: { $in: candidateIds } })
      .populate("role") // Assuming 'role' is a reference field in User model
      .select("username email resume"); // Select specific fields to retrieve

    // Map answered questions and resume to candidates
    const candidatesWithDetails = candidates
      .map((candidate) => {
        const application = applications.find((app) =>
          app.candidateId.equals(candidate._id)
        );
        if (application) {
          return {
            _id: candidate._id,
            role: candidate.role.name, // Adjust as per your schema
            username: candidate.username,
            email: candidate.email,
            resume: application.resume, // Assuming resume is stored in Application model
            r1Answers: application.r1Answers, // Assuming r1Answers is stored in Application model
            r2Answers: application.r2Answers, // Assuming r2Answers is stored in Application model
          };
        }
        return null;
      })
      .filter((candidate) => candidate !== null);

    // Return array of candidates with detailed information including resume
    return candidatesWithDetails;
  } catch (error) {
    console.error(`Error fetching applications for job ID ${jobId}:`, error);
    throw new Error(
      `Failed to fetch applications for job ID ${jobId}. Please try again later.`
    );
  }
};

export const getAllJobsAssignedService = async () => {
  try {
    return await Job.find({
      recruiters: { $exists: true, $ne: [] }, // $ne (not equal) to an empty array
    });
  } catch (error) {
    console.error("Error fetching jobs assigned:", error);
    throw new Error("Failed to fetch jobs assigned. Please try again later.");
  }
};
// export const getAllJobsNotAssignedService = async () => {
//   return await Job.find({ recruiters: { $exists: false } });
// };
// export const getAllJobsAssignedService = async () => {
//   return await Job.find({ recruiters: { $exists: true } });
// };
export const assignRecruitersService = async (
  jobId: string,
  recruiters: string[]
) => {
  //if recuiters is zero throw error
  if (recruiters.length === 0) {
    throw new Error("No recruiters selected");
  }
  const job = await Job.findById(jobId);
  if (!job) throw new Error("Job not found");

  job.recruiters = recruiters;
  await job.save();
  return job;
};

export const addR2QuestionsService = async (
  jobId: string,
  r2Questions: { question: string; correctAnswer: string }[]
) => {
  const job = await Job.findById(jobId);
  if (!job) throw new Error("Job not found");

  job.r2Questions = r2Questions;
  await job.save();
  return job;
};

export const getResponsesService = async (jobId: string) => {
  return await Response.find({ jobId });
};
