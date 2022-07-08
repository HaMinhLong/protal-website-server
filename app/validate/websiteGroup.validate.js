const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const WebsiteGroup = db.websiteGroup;

const validateCreate = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const websiteGroup = await WebsiteGroup.findOne({
          where: { name: value },
        });
        if (websiteGroup && value !== body.nameOld) {
          return Promise.reject("Nhóm website đã tồn tại");
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
