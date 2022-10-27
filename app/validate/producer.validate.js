const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const Producer = db.producer;

const validateCreate = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const producer = await Producer.findOne({
          where: { name: value },
        });
        if (producer && value !== body.nameOld) {
          return Promise.reject("Nhà sản xuất đã tồn tại");
        }
      }),
    body("producerGroupId").not().isEmpty(),
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
