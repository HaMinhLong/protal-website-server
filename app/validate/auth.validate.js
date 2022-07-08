const { body } = require("express-validator");
var bcrypt = require("bcryptjs");

// PROJECT IMPORT
const db = require("../models");
const User = db.user;

const validateLogin = () => {
  return [
    body("username")
      .not()
      .isEmpty()
      .custom(async (value) => {
        const user = await User.findOne({
          where: {
            username: value,
          },
        });
        if (!user) {
          return Promise.reject("Tài khoản không tồn tại");
        }
        if (user.status === -2) {
          return Promise.reject(
            "Tài khoản của ban chưa được kích hoạt. Vui lòng đổi mật khẩu đề kích hoạt tài khoản"
          );
        }
        if (user.status === 0 || user.status === -1) {
          return Promise.reject("Tài khoản của ban không được phép đăng nhập");
        }
      }),
    body("password")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const user = await User.findOne({
          where: {
            username: body.username,
          },
        });
        if (!user) {
          return;
        }
        var passwordIsValid = bcrypt.compareSync(value, user.password);
        if (!passwordIsValid) {
          return Promise.reject("Vui lòng nhập đúng mật khẩu");
        }
      }),
  ];
};

module.exports = {
  validateLogin,
};
