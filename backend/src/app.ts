import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/authRoutes";
import { userRouter } from "./routes/userRoutes";
import jobRouter from "./routes/job";
import dotenv from "dotenv";
import { applicationRouter } from "./routes/applicationRouter";

dotenv.config();
// const port = process.env;
// console.log(port);
const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH,TRACE,CONNECT",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to ATS Prototype API!");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);
// app.use("/api/recuiters", userRouter);

app.use("*", (req: Request, res: Response) => {
  res.status(404).send("Resource not found");
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
