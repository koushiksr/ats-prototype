import { Router } from "express";
import {
  registerCandidate,
  getJobPosts,
  applyForJob,
} from "../controllers/candidate";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// router.post("/register", registerCandidate);
// router.get("/jobs", getJobPosts);
// router.post("/apply", applyForJob);
router.post("/register", registerCandidate);
router.get("/jobs", authMiddleware(["Candidate"]), getJobPosts);
router.post("/apply", authMiddleware(["Candidate"]), applyForJob);

export default router;
