const { body } = require("express-validator");

// PROJECT IMPORT
const db = require("../models");
const Article = db.article;

const validateCreate = () => {
  return [
    body("title")
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const { body } = req;
        const article = await Article.findOne({
          where: { title: value },
        });
        if (article && value !== body.titleOld) {
          return Promise.reject("Tin tức đã tồn tại");
        }
      }),
    body("websiteId").not().isEmpty(),
    body("categoryId").not().isEmpty(),
    body("url").not().isEmpty(),
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
