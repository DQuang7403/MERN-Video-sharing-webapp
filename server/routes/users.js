import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
  subcribe,
  like,
  dislike,
  unsubscribe,
  getUserByUsername,
} from "../controllers/users.js";
import { authVerify } from "../middleware/authVerify.js";
const router = express.Router();

router.get("/find/:id", getUser);
router.get("/get/:username", getUserByUsername)
router.put("/update/:id", authVerify, updateUser);
router.delete("/delete/:id", authVerify, deleteUser);
router.put("/sub/:id", authVerify, subcribe);
router.put("/unsub/:id", authVerify, unsubscribe);
router.put("/like/:videoId", authVerify, like);
router.put("/dislike/:videoId", authVerify, dislike);

export default router;
