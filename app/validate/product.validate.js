const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const Product = db.product;

const validateCreate = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const product = await Product.findOne({
          where: { name: value },
        });
        if (product && value !== body.nameOld) {
          return Promise.reject("Sản phẩm đã tồn tại");
        }
      }),
    body("price").not().isEmpty(),
    body("websiteId").not().isEmpty(),
    body("categoryId").not().isEmpty(),
    body("producerId").not().isEmpty(),
    body("supplierId").not().isEmpty(),
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
