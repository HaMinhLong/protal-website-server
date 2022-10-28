const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");

const validateCreate = () => {
  return [
    body("name").not().isEmpty(),
    body("phone").not().isEmpty(),
    body("address").not().isEmpty(),
    body("websiteId").not().isEmpty(),
    body("paymentMethodId").not().isEmpty(),
    body("status").not().isEmpty(),
    body("productOrders").not().isEmpty(),
  ];
};

const validateUpdateStatus = () => {
  return [body("status").not().isEmpty()];
};

module.exports = {
  validateCreate,
  validateUpdateStatus,
};
