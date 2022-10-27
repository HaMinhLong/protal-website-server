const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const Supplier = db.supplier;

const validateCreate = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const supplier = await Supplier.findOne({
          where: { name: value },
        });
        if (supplier && value !== body.nameOld) {
          return Promise.reject("Nhà cung cấp đã tồn tại");
        }
      }),
    body("supplierGroupId").not().isEmpty(),
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
