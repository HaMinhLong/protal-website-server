const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const statusErrors = require("../errors/status-error");

verifyToken = (req, res, next) => {
  let token = req.headers["access-token"];
  if (!token) {
    return res.status(statusErrors.unauthorized).json({
      success: false,
      error: "No token provided!",
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(statusErrors.unauthorized).json({
        success: false,
        error: err.message,
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    req.userGroupId = decoded.userGroupId;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt;
