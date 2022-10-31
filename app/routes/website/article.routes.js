// PROJECT IMPORT
const controller = require("../../controllers/article.controller");
const { validate } = require("../../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../../validate/article.validate");

module.exports = function (app) {
  app.get("/web/v1/article", controller.getList);

  app.get("/web/v1/article/:id", controller.getOne);

  app.get("/web/v1/article/url/:url", controller.getOneByUrl);

  app.post("/web/v1/article", [validate(validateCreate())], controller.create);

  app.put(
    "/web/v1/article/:id",
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/web/v1/article/updateStatus/:id",
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/web/v1/article/:id", controller.deleteRecord);
};
