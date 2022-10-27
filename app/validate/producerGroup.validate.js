const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const ProducerGroup = db.producerGroup;

const validateCreate = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const producerGroup = await ProducerGroup.findOne({
          where: { name: value },
        });
        if (producerGroup && value !== body.nameOld) {
          return Promise.reject("Nhóm nhà sản xuất đã tồn tại");
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
