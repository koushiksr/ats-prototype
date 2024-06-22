import { Router } from "express";
import { getAllRecuiters, getCandidate } from "../controllers/user";
import { authMiddleware } from "../middleware/authMiddleware";
import { User } from "../models/user";

const router = Router();

router.get("/recuiters", authMiddleware(["Coordinator"]), getAllRecuiters);
router.get("/candidate/:id", authMiddleware(["Recruiter"]), getCandidate);
router.get("/:candidateId", async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const candidate = await User.findById(candidateId).populate(
      "coordinatorQuestions"
    ); // Populate coordinator questions if they are referenced

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json({
      name: candidate.name,
      email: candidate.email,
      username: candidate.username,
      resume: candidate.resume,
      coordinatorQuestions: candidate.coordinatorQuestions,
    });
  } catch (error) {
    console.error("Error fetching candidate details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export { router as userRouter };
