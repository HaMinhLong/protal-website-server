// PROJECT IMPORT
const controller = require("../../controllers/category.controller");
const { validate } = require("../../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../../validate/category.validate");

module.exports = function (app) {
  app.get("/web/v1/category", controller.getList);

  app.get("/web/v1/category/:id", controller.getOne);

  app.post("/web/v1/category", [validate(validateCreate())], controller.create);

  app.put(
    "/web/v1/category/:id",
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/web/v1/category/updateStatus/:id",
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/web/v1/category/:id", controller.deleteRecord);
};
