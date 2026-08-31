const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const signedCookieToken = req.signedCookies?.token;
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  const token = signedCookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized user" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    return next();
  } catch (error) {
    console.log("auth", error.message);
    return res.status(401).json({ msg: "Unauthorized user" });
  }
};

module.exports = authMiddleware;
