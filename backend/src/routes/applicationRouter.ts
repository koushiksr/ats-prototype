import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
// import fs from "fs";
import Application from "../models/application";
import { Job } from "../models/job";
import { authMiddleware } from "../middleware/authMiddleware";

// Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Ensure 'uploads/' directory exists in your project root
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });
const upload = multer({ storage: multer.memoryStorage() });

// Submit a new application route
// Instantiate router
const router = Router();

// Helper to find application by ID and return with error handling
const getApplicationById = async (applicationId: string) => {
  try {
    return await Application.findById(applicationId)
      .populate("candidate")
      .populate("job");
  } catch (error) {
    throw new Error("Application not found");
  }
};

router.get("/:jobId/:candidateId", async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;
    const application = await Application.findOne({
      jobId: jobId,
      candidateId: candidateId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/recruiter", authMiddleware(["Recruiter"]), async (req, res) => {
  try {
    // const jobs = await Job.find({ recruiters: req.user.id }).select("_id");
    const applications = await Job.find({ recruiters: req.user.id });

    console.log(applications);
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/",
  authMiddleware(["Candidate"]),
  upload.single("resume"),
  async (req: Request, res: Response) => {
    const { jobTitle, r1Answers, r2Answers } = req.body;
    const resumeBuffer = req.file?.buffer; // Access file buffer instead of path

    try {
      const job = await Job.findOne({ jobTitle: jobTitle });
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      // console.log({ job });

      const application = new Application({
        candidateId: req.user.id,
        jobId: job._id, // Assuming jobId should be set to job's _id
        resume: resumeBuffer, // Save file buffer directly
        r1Answers: JSON.parse(r1Answers), // Parse r1Answers to array
        r2Answers: JSON.parse(r2Answers), // Parse r2Answers to array
      });

      await application.save();
      res.status(201).json(application);
    } catch (error) {
      console.error("Error submitting application:", error);
      res.status(500).json({ error: "Error submitting application" });
    }
  }
);
// Shortlist an application
router.post(
  "/:applicationId/shortlist",
  authMiddleware(["Recruiter", "Coordinator"]),
  async (req: Request, res: Response) => {
    const { applicationId } = req.params;

    try {
      const application = await getApplicationById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      application.shortlisted = true;
      await application.save();
      res.status(200).json({ message: "Application shortlisted successfully" });
    } catch (error) {
      console.error("Error shortlisting application:", error);
      res.status(500).json({ error: "Error shortlisting application" });
    }
  }
);

// Submit R2 check answers
router.post(
  "/:applicationId/r2check",
  authMiddleware(["Recruiter"]),
  async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const { r2Answers } = req.body;

    try {
      const application = await getApplicationById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      application.r2Answers = r2Answers;
      await application.save();
      res.status(200).json({ message: "R2 check submitted successfully" });
    } catch (error) {
      console.error("Error submitting R2 check:", error);
      res.status(500).json({ error: "Error submitting R2 check" });
    }
  }
);

// Get shortlisted applications
router.get(
  "/shortlisted",
  authMiddleware(["Employer", "Coordinator"]),
  async (req: Request, res: Response) => {
    try {
      const applications = await Application.find({ shortlisted: true })
        .populate("candidate")
        .populate("job");
      res.status(200).json(applications);
    } catch (error) {
      console.error("Error fetching shortlisted applications:", error);
      res
        .status(500)
        .json({ error: "Error fetching shortlisted applications" });
    }
  }
);

export { router as applicationRouter };
