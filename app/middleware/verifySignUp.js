const db = require("../models");
const User = db.user;
const statusErrors = require("../errors/status-error");

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: "Tên tài khoản đã được sử dụng!",
        message: "Tên tài khoản đã được sử dụng!",
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(statusErrors.badRequest).json({
          success: false,
          error: "Email đã được sử dụng!",
          message: "Email đã được sử dụng!",
        });
        return;
      }

      next();
    });
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
