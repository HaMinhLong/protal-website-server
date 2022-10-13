const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const Menu = db.menu;

const validateCreate = () => {
  return [
    body("text")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const menu = await Menu.findOne({
          where: { text: value },
        });
        if (menu && value !== body.textOld) {
          return Promise.reject("Menu website đã tồn tại");
        }
      }),
    body("icon").not().isEmpty(),
    body("position").not().isEmpty(),
    body("url").not().isEmpty(),
    body("websiteId").not().isEmpty(),
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
