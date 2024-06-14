import mongoose from "mongoose";
import User from "../models/User.js";
import bcript from "bcryptjs";
import { createError } from "../middleware/error.js";
import jwt from "jsonwebtoken";

// @desc Register new user
// @route POST /api/auth/signup
// @access Public
export const signup = async (req, res, next) => {
  try {
    const salt = bcript.genSaltSync(10);
    const email = req.body.email;
    const hashPassword = bcript.hashSync(req.body.pwd, salt);
    const checkEmail = await User.findOne({ email: email });
    if (checkEmail) {
      return next(createError(409, "Email already exists!"));
    }
    const newUser = new User({ ...req.body, password: hashPassword });

    await newUser.save();
    res.status(200).send("User has been created successfully!");
  } catch (err) {
    next(err);
  }
};

// @desc Login user
// @route POST /api/auth/signin
// @access Public
export const signin = async (req, res, next) => {
  try {
    const userInfo = await User.findOne({
      email: req.body.email,
      signWithGoogle: false,
    });
    if (!userInfo) {
      return next(createError(404, "User not found!"));
    }
    const isCorrect = await bcript.compare(req.body.pwd, userInfo.password);
    if (!isCorrect) {
      return next(createError(400, "Please check your credentials!"));
    }
    const { pwd, password, ...otherInfo } = userInfo._doc;

    const accessToken = jwt.sign(
      {
        id: userInfo._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      {
        id: userInfo._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json({ access_token: accessToken, user_info: { ...otherInfo } });
  } catch (err) {
    next(err);
  }
};

// @desc Refresh token
// @route GET /api/auth/refresh
// @access Public
export const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json("Unauthorized");
  }
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json("Token is not valid!");

      const currentUser = await User.findOne({
        _id: decoded.id,
      });

      if (!currentUser) return res.status(404).json("User not found!");
      const { pwd, password, ...otherInfo } = currentUser._doc;
      const accessToken = jwt.sign(
        {
          id: currentUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );
      res
        .status(200)
        .json({ access_token: accessToken, user_info: { ...otherInfo } });
    },
  );
};

// @desc Logout user
// @route POST /api/auth/signout
// @access Public - clear the existing cookie
export const signout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(204).json("You are not logged in!");
  }
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json("Signed out successfully!");
};

// @desc Login user with Google
// @route POST /api/auth/google
// @access Public
export const signInWithGoogle = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (user && user.signWithGoogle === false) {
      return res.status(400).send("Email already exists!");
    } else if (!user) {
      const newUser = new User({ ...req.body, signWithGoogle: true });
      await newUser.save();

      const user = await User.findOne({
        email: req.body.email,
      });
      const { pwd, password, ...otherInfo } = user._doc;
    }
    const { pwd, password, ...otherInfo } = user._doc;
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json({ access_token: accessToken, user_info: { ...otherInfo } });
  } catch (err) {
    next(err);
  }
};
