const {
  isAccessTokenValid,
} = require("../utils/token");

const authenticatedUser = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split("Bearer ")[1]?.trim();

  if (!accessToken) {
    return res.status(401).json({
      msg: "Please login again to continue. No access token provided.",
    });
  }

  try {
    const payload = await isAccessTokenValid(accessToken);
    req.user = payload; 
    req.userId = payload.id; 
    return next(); 
  } catch (error) {
    console.error("Access token validation failed:", error);
    return res.status(401).json({
      msg: "Invalid access token. Please login again.",
    });
  }
};

module.exports = authenticatedUser;
