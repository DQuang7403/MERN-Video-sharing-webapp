import { createError } from "../middleware/error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

// @desc Get video by id
// @route GET /api/video/:videoId
// @access Public
export const getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return next(createError(404, "Video not found!"));
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

// @desc Update video by id
// @route PUT /api/video/:videoId
// @access Private
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (video) {
      if (video.userId === req.user.id) {
        await Video.findByIdAndUpdate(
          req.params.videoId,
          { $set: req.body },
          { new: true },
        );
        res.status(200).json("Video updated successfully!");
      }
      return next(createError(403, "You can only update your video"));
    } else {
      return next(createError(404, "Video not found!"));
    }
  } catch (err) {
    next(err);
  }
};
// @desc Delete video by id
// @route DELETE /api/video/:videoId
// @access Private
export const deleteVideo = async (req, res, next) => {
  const video = await Video.findById(req.params.videoId);
  try {
    if (video) {
      if (video.userId === req.user.id) {
        await Video.findByIdAndDelete(req.params.videoId);
        res.status(200).json("Video has been deleted!");
      } else {
        return next(createError(403, "You can only delete your video"));
      }
    } else {
      res.status(404).json("Video not found!");
    }
  } catch (err) {
    next(err);
  }
};

// @desc Add new video
// @route POST /api/video/add
// @access Private
export const addNewVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (error) {
    next(error);
  }
};

// @desc Add view
// @route PUT /api/video/view/:videoId
// @access Public
export const addView = async (req, res, next) => {
  const video = Video.findById(req.params.videoId);
  if (!video) {
    res.status(404).json("No videos found");
  }
  try {
    await Video.findByIdAndUpdate(req.params.videoId, {
      $inc: { views: 1 },
    });
    res.status(200).json("Viewed");
  } catch (error) {
    next(error);
  }
};

//@desc Get video by user
//@route GET /api/video/user/:userId
//@access Public
export const getVideoByUser = async (req, res, next) => {
  try {
    const videos = await Video.find({ userId: req.params.userId });
    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
  }
};

// @desc Get video randomly
// @route GET /api/video/random
// @access Public
export const getRandomVideo = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 30 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

// @desc Get video by tags
// @route GET /api/video/tags?tags=tag1,tag2
// @access Public
export const getVideoByTags = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(15);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// @desc Get subscribed video
// @route GET /api/video/sub
// @access Private
export const getSubVideo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subUser = user.subscribedUsers;
    const list = await Promise.all(
      subUser.map((channel) => {
        return Video.find({ userId: channel.id });
      }),
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
};

// @desc Get trending videos
// @route GET /api/video/trending
// @access Public
export const getTrendingVideo = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// @desc Get trending tags
// @route GET /api/video/trending/tags
// @access Public
export const getTags = async (req, res, next) => {
  try {
    const tags = await Video.aggregate([
      { $group: { _id: null, tags: { $push: "$tags" } } },
      {
        $project: {
          _id: 0,
          tags: {
            $setIntersection: [
              {
                $reduce: {
                  input: "$tags",
                  initialValue: [],
                  in: { $concatArrays: ["$$value", "$$this"] },
                },
              },
            ],
          },
        },
      },
      { $limit: 5 },
    ]);
    res.status(200).json(tags[0]);
  } catch (error) {
    next(error);
  }
};

// @desc Get liked videos
// @route GET /api/video/like
// @access Private
export const getLikeVideo = async (req, res, next) => {
  try {
    // const user = await User.findById(req.user.id);
    // if (!user) {
    //   res.status(404).json("User not found");
    // }
    const likedVideo = await Video.find({ likes: req.user.id });
    if (likedVideo.length <= 0) {
      res.status(404).json("No video found");
    }
    res.status(200).json(likedVideo);
  } catch (error) {
    next(error);
  }
};
