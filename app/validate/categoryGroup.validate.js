const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const CategoryGroup = db.categoryGroup;

const validateCreate = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const categoryGroup = await CategoryGroup.findOne({
          where: { name: value },
        });
        if (categoryGroup && value !== body.nameOld) {
          return Promise.reject("Nhóm chuyên mục đã tồn tại");
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
