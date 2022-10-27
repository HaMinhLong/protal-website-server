const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");

const validateCreate = () => {
  return [
    body("name").not().isEmpty(),
    body("phone").not().isEmpty(),
    body("message").not().isEmpty(),
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
