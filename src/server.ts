import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";

dotenv.config();

connectDB();

const app = express();

app.use(cors(corsConfig));
// Logging
app.use(morgan("dev"));
app.use(express.json());

// Routes

app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

export default app;
