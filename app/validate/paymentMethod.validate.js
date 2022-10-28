const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const PaymentMethod = db.paymentMethod;

const validateCreate = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const paymentMethod = await PaymentMethod.findOne({
          where: { name: value },
        });
        if (paymentMethod && value !== body.nameOld) {
          return Promise.reject("Phương thức thanh toán đã tồn tại");
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
