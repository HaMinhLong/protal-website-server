// THIRD IMPORT

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// PROJECT IMPORT
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const statusErrors = require("../errors/status-error");

const signUp = (req, res) => {
  const { username, email, password } = res.body;
  // Save User to Database
  User.create({
    id:
      Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
      100000000000,
    username: username,
    email: email,
    password: bcrypt.hashSync(password, 8),
  })
    .then((user) => {
      res.json({
        results: {
          list: user,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Đăng ký tài khoản thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi đăng ký tài khoản!",
      });
    });
};

const signIn = (req, res) => {
  const { username } = req.body;
  User.findOne({
    where: {
      username: username,
    },
  })
    .then((user) => {
      var token = jwt.sign(
        { id: user.id, userGroupId: user.userGroupId },
        config.secret,
        {
          expiresIn: 86400, // 24 hours
        }
      );

      res.status(statusErrors.success).json({
        results: {
          list: {
            id: user.id,
            username: user.username,
            userGroupId: user.userGroupId,
            email: user.email,
            accessToken: token,
          },
        },
        success: true,
        error: "",
        message: "",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi đăng nhập!",
      });
    });
};

const verifyToken = (req, res) => {
  let token = req.headers["x-access-token"];

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
    } else {
      return res.status(statusErrors.success).json({
        success: true,
        error: "",
        message: "Authorized!",
      });
    }
  });
};

const currentUser = (req, res) => {
  const { userId } = req;
  User.findByPk(userId).then((user) => {
    res.status(statusErrors.success).json({
      results: {
        list: user,
        pagination: [],
      },
      success: true,
      error: "",
      message: "",
    });
  });
};

module.exports = {
  signUp,
  signIn,
  verifyToken,
  currentUser,
};
