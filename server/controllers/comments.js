import { createError } from "../middleware/error.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

// @desc Add comment
// @route POST /api/comment
// @access Private
export const addComment = async (req, res, next) => {
  const newComment = new Comment({ userId: req.user.id, ...req.body });
  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (error) {
    next(error);
  }
};
// @desc Get video comments
// @route GET /api/comment/:videoId
// @access Public
export const getVideoComment = async (req, res, next) => {
  try {
    const videoComments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(videoComments);
  } catch (error) {
    next(error);
  }
};

// @desc Delete comment
// @route DELETE /api/comment/:id
// @access Private
export const deleteComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(createError(404, "Comment is not existed or has been deleted!"));
  }
  const video = await Video.findById(comment.videoId);
  try {
    if (comment.userId === req.user.id && video) {
      await Comment.findByIdAndDelete(comment.id);
      res.status(200).json("You have deleted the comment successfully!");
    } else {
      return next(createError(403, "You can only delete your comments!"));
    }
  } catch (error) {
    next(error);
  }
};
