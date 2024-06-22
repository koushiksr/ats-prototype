import { Request, Response } from "express";
import { getAllRecuitersService, getCandidatService } from "../services/users"; // Import the Job service

export const getAllRecuiters = async (req: Request, res: Response) => {
  try {
    const jobs = await getAllRecuitersService();
    res.json(jobs);
  } catch (error) {
    res.status(500).send("Server error");
  }
};
export const getCandidate = async (req: Request, res: Response) => {
  try {
    const jobs = await getCandidatService(req.params.id);
    res.json(jobs);
  } catch (error) {
    res.status(500).send("Server error");
  }
};
