const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const Website = db.website;

const validateCreate = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        console.log("body", body);
        const website = await Website.findOne({
          where: { name: value },
        });
        if (website && value !== body.nameOld) {
          return Promise.reject("Website đã tồn tại");
        }
      }),
    body("websiteGroupId").not().isEmpty(),
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
