const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const Op = db.Sequelize.Op;
const Category = db.category;

const validateCreate = () => {
  return [
    body("text")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const category = await Category.findOne({
          where: { [Op.and]: [{ text: value }, { websiteId: body.websiteId }] },
        });
        if (category && value !== body.textOld) {
          return Promise.reject("Chuyên mục đã tồn tại");
        }
      }),
    body("position").not().isEmpty(),
    body("url").not().isEmpty(),
    body("isHome").not().isEmpty(),
    body("websiteId").not().isEmpty(),
    body("categoryGroupId").not().isEmpty(),
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
