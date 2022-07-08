const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const UserGroup = db.userGroup;

const validateCreate = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const userGroup = await UserGroup.findOne({
          where: { name: value },
        });
        if (userGroup && value !== body.nameOld) {
          return Promise.reject("Nhóm tài khoản đã tồn tại");
        }
      }),
    body("status").not().isEmpty(),
  ];
};

const validateUpdateStatus = () => {
  return [body("status").not().isEmpty()];
};

module.exports = {
  validateCreate,
  validateUpdateStatus,
};
