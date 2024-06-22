import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user"; // Import User model from correct path
import { authMiddleware } from "../middleware/authMiddleware";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET || "temp";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    if (!username || !email || !role || !password) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, role, password: hashedPassword });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");

    const token = jwt.sign({ id: user._id, role: user.role }, secret, {
      expiresIn: "365d",
    });
    res
      .status(200)
      .send({
        token,
        role: user.role,
        username: user.username,
        email: user.email,
      });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

// Use middleware with roles to protect routes
router.use(authMiddleware(["admin", "user"]));

export { router as authRouter };
