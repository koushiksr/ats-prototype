import { Router } from "express";
import {
  createJob,
  getAllJobs,
  assignRecruiters,
  addR2Questions,
  getResponses,
  getAllJobsNotAssigned,
  getAllJobsAssigned,
  getRecJobApplies,
} from "../controllers/job";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware(["Employer"]), createJob);
router.get("/", authMiddleware(["Coordinator"]), getAllJobs);
router.get(
  "/notassigned",
  authMiddleware(["Coordinator"]),
  getAllJobsNotAssigned
);
router.get("/assigned", authMiddleware(["Candidate"]), getAllJobsAssigned);
router.post(
  "/:id/recruiters",
  authMiddleware(["Coordinator"]),
  assignRecruiters
);
router.post("/:id/r2", authMiddleware(["Coordinator"]), addR2Questions);
router.get("/:id/responses", authMiddleware(["Coordinator"]), getResponses);
router.get("/candidates/:id", authMiddleware(["Recruiter"]), getRecJobApplies);
export default router;
