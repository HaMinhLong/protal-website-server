const { body } = require("express-validator");
var bcrypt = require("bcryptjs");

// PROJECT IMPORT
const db = require("../models");
const User = db.user;

const validateCreate = () => {
  return [
    body("fullName").not().isEmpty(),
    body("username")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const user = await User.findOne({
          where: { username: value },
        });
        if (user && value !== body.usernameOld) {
          return Promise.reject("Tài khoản đã tồn tại");
        }
      }),
    body("password").not().isEmpty(),
    body("mobile").not().isEmpty(),
    body("email").not().isEmpty().isEmail(),
    body("userGroupId").not().isEmpty(),
    body("status").not().isEmpty(),
  ];
};

const validateUpdateStatus = () => {
  return [body("status").not().isEmpty()];
};

const validateChangePasswordLogin = () => {
  return [body("newPassword").not().isEmpty()];
};

const validateChangePasswordNotLogin = () => {
  return [
    body("username")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const user = await User.findOne({
          where: {
            username: value,
          },
        });
        if (!user) {
          return Promise.reject("Tài khoản không tồn tại");
        }
      }),
    body("oldPassword")
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
    body("newPassword").not().isEmpty(),
  ];
};

module.exports = {
  validateCreate,
  validateUpdateStatus,
  validateChangePasswordLogin,
  validateChangePasswordNotLogin,
};
