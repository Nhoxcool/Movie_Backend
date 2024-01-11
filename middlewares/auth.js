const { sendError } = require("../utils/helper");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuth = async (req, res, next) => {
  const token = req.headers?.authorization;

  const jwtToken = token.split("Bearer ")[1];

  if (!jwtToken) return sendError(res, "Invalid Token");
  const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const { userId } = decode;

  const user = await User.findById(userId);

  if (!user) return sendError(res, "Invalid Token use not found!", 404);

  req.user = user;

  next();
};
