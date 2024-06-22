import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const secret = process.env.JWT_SECRET || "temp"; // Access the secret directly from environment variables

export const authController = {
  async register(userData: {
    name: string;
    email: string;
    role: string;
    password: string;
  }) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({ ...userData, password: hashedPassword });
      await user.save();
      return user;
    } catch (error) {
      throw new Error("Registration failed");
    }
  },

  async login(userData: { email: string; password: string }) {
    try {
      const { email, password } = userData;
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign({ id: user._id, role: user.role }, secret, {
        expiresIn: "1h",
      });
      return { token };
    } catch (error) {
      throw new Error("Login failed");
    }
  },
};
