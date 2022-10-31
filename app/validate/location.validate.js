const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const Location = db.location;

const validateCreate = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const location = await Location.findOne({
          where: { name: value },
        });
        if (location && value !== body.nameOld) {
          return Promise.reject("Địa điểm đã tồn tại");
        }
      }),
    body("websiteId").not().isEmpty(),
    body("location").not().isEmpty(),
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
