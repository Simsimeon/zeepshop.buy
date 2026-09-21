const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

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
const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, msg: "Unauthorized user" });
    }

    const userRole = req.user?.userInfo?.role || req.user?.role;

    if (!roles.includes(userRole)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }

    return next();
  };
};

module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.authorizePermissions = authorizePermissions;
