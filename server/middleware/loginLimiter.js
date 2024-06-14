import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    message: "Too many login attempts, please try again later",
    handler: (req, res, next, options) =>{
      res.status(options.statusCode).json(options.message);
    }
  
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export default loginLimiter