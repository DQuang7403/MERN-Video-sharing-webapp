import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import cors from "cors";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";

import { logger } from "./middleware/logEvents.js";

const app = express();
dotenv.config();
const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      throw err;
    });
};

app.use(logger); 
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/comment", commentRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});
const port = process.env.PORT || 5000;
// app.use(errorHandler);
app.listen(5000, () => {
  connectDB();
  console.log(`Server started on http://localhost:${port}`);
});
