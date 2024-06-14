import express from "express";
import {
  addComment,
  getVideoComment,
  deleteComment,
} from "../controllers/comments.js";
import { authVerify } from "../middleware/authVerify.js";
const router = express.Router();

router.post("/add", authVerify, addComment);
router.get("/get/:videoId", getVideoComment);
router.delete("/delete/:id", authVerify, deleteComment);
export default router;
