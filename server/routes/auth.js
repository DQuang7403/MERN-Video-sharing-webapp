import express from "express";
import { signup, signin, signout, refresh, signInWithGoogle } from "../controllers/auth.js";
import loginLimiter from "../middleware/loginLimiter.js";
const router = express.Router();

//Create User/Channel
router.post("/signup", signup);

//Sign in User
router.post("/signin", loginLimiter, signin);

//Refresh Token
router.get("/refresh", refresh)

//Sign out User
router.post("/signout", signout);

//Google sign in
router.post("/google", signInWithGoogle);

export default router;
