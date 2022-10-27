const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const SupplierGroup = db.supplierGroup;

const validateCreate = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const supplierGroup = await SupplierGroup.findOne({
          where: { name: value },
        });
        if (supplierGroup && value !== body.nameOld) {
          return Promise.reject("Nhóm nhà cung cấp đã tồn tại");
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
