import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET || "temp"; // Secret key from environment variables
interface DecodedToken {
  id: string;
  role: string;
}

export const authMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      console.log({ token });
      if (!token) return res.status(401).send("Access denied");

      const decoded = jwt.verify(token, secret) as DecodedToken;
      req.user = decoded;
      const user = await User.findById(req.user.id);
      if (!user || user.role !== req.user.role) {
        return res.status(401).send("Unauthorized");
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).send("Access denied");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(400).send("Invalid token");
    }
  };
};
