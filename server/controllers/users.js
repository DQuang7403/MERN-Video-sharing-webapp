import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../middleware/error.js";
import bcript from "bcryptjs";

// @desc Get user by id
// @route GET /api/user/find/:id
// @access Public
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));
    const { password, pwd, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    next(err);
  }
};

//desc Get user by username
//@route GET /api/user/get/:username
//@acess Public
export const getUserByUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return next(createError(404, "User not found!"));
    const { password, pwd, ...otherInfo } = user._doc;
    res.status(200).json(otherInfo);
  } catch (error) {
    next(error);
  }
};

// @desc Update user
// @route PUT /api/user/:id
// @access Private
export const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    const salt = bcript.genSaltSync(10);
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            ...req.body,
            ...(req.body.pwd && {
              password: bcript.hashSync(req.body.pwd, salt),
              pwd: req.body.pwd,
            }),
          },
        },
        { new: true },
      );
      const { password, pwd, ...other } = updateUser._doc;
      res.status(200).json(other);
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

// @desc Delete user
// @route DELETE /api/user/:id
// @access Private
export const deleteUser = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

// @desc Subscribe
// @route PUT /api/user/subscribe/:id
// @access Private
export const subcribe = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(createError(404, "User not found!"));

  const userDetails = await User.findById(req.user.id);
  if (userDetails.subscribedUsers.id === req.params.id) {
    return next(createError(403, "You have already subcribed to this channel"));
  }

  if (req.params.id !== req.user.id) {
    try {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $push: {
            subscribedUsers: {
              id: req.params.id,
              name: req.body.name,
              username: req.body.username,
              profileUrl: req.body.profileUrl,
            },
          },
        },
        { new: true },
      );
      await User.findByIdAndUpdate(
        req.params.id,
        {
          $inc: { subscribers: 1 },
        },
        { new: true },
      );
      res.status(200).json("Subscribed successfully");
    } catch (err) {
      next(err);
    }
  } else {
    res.status(403).json("You can't subcribe to your account");
  }
};

// @desc Unsubscribe
// @route PUT /api/user/unsubscribe/:id
// @access Private
export const unsubscribe = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(createError(404, "User not found!"));

  const userDetails = await User.findById(req.user.id);
  if (!userDetails.subscribedUsers.id === req.params.id) {
    return next(createError(403, "You haven't subcribed to this channel yet"));
  }

  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: { id: req.params.id } },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json("Unsubscribed successfully");
  } catch (err) {
    next(err);
  }
};

// @desc Like video
// @route PUT /api/user/like/:videoId
// @access Private
export const like = async (req, res, next) => {
  const videoInfo = await Video.findById(req.params.videoId);
  if (!videoInfo) {
    return next(createError(404, "Video not found!"));
  }
  const isLike = videoInfo.likes.includes(req.user.id);
  try {
    if (isLike) {
      await Video.findByIdAndUpdate(videoInfo, {
        $pull: { likes: req.user.id },
      });
      res.status(200).json("Unliked the video!");
    } else {
      await Video.findByIdAndUpdate(videoInfo, {
        $addToSet: { likes: req.user.id },
        $pull: { dislikes: req.user.id },
      });
      res.status(200).json("You liked the video!");
    }
  } catch (error) {
    next(error);
  }
};

// @desc Dislike video
// @route PUT /api/user/dislike/:videoId
// @access Private
export const dislike = async (req, res, next) => {
  const videoInfo = await Video.findById(req.params.videoId);
  const isDislike = videoInfo.dislikes.includes(req.user.id);

  try {
    if (isDislike) {
      await Video.findByIdAndUpdate(videoInfo, {
        $pull: { dislikes: req.user.id },
      });
      res.status(200).json("Undisliked the video!");
    } else {
      await Video.findByIdAndUpdate(videoInfo, {
        $addToSet: { dislikes: req.user.id },
        $pull: { likes: req.user.id },
      });
      res.status(200).json("You disliked the video!");
    }
  } catch (error) {
    next(error);
  }
};
