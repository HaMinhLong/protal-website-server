const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const Collection = db.collection;

const validateCreate = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const collection = await Collection.findOne({
          where: { name: value },
        });
        if (collection && value !== body.nameOld) {
          return Promise.reject("Bộ danh sách đã tồn tại");
        }
      }),
    body("status").not().isEmpty(),
    body("websiteId").not().isEmpty(),
    body("categoryId").not().isEmpty(),
  ];
};

const validateUpdateStatus = () => {
  return [body("status").not().isEmpty()];
};

module.exports = {
  validateCreate,
  validateUpdateStatus,
};
