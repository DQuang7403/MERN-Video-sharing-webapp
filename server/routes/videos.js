import express from "express";
import {
  addNewVideo,
  deleteVideo,
  getVideoById,
  updateVideo,
  getVideoByTags,
  getRandomVideo,
  addView,
  getSubVideo,
  getTrendingVideo,
  getVideoByUser,
  getTags,
  getLikeVideo
} from "../controllers/videos.js";
import { authVerify } from "../middleware/authVerify.js";
const router = express.Router();

router.put("/update/:videoId", authVerify, updateVideo);
router.delete("/delete/:videoId", authVerify, deleteVideo);
router.post("/add", authVerify, addNewVideo);
router.get("/sub", authVerify, getSubVideo);
router.put("/view/:videoId", addView);
router.get("/get/:videoId", getVideoById);
router.get("/get/user/:userId", getVideoByUser);
router.get("/tags", getVideoByTags);
router.get("/random", getRandomVideo);
router.get("/trending", getTrendingVideo);
router.get("/trending/tags", getTags);
router.get("/like", authVerify, getLikeVideo);

export default router;
