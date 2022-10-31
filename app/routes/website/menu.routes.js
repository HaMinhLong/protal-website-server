// PROJECT IMPORT
const controller = require("../../controllers/menu.controller");
const { validate } = require("../../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../../validate/menu.validate");

module.exports = function (app) {
  app.get("/web/v1/menu", controller.getList);

  app.get("/web/v1/menu/:id", controller.getOne);

  app.post("/web/v1/menu", [validate(validateCreate())], controller.create);

  app.put(
    "/web/v1/menu/:id",
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/web/v1/menu/updateStatus/:id",
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/web/v1/menu/:id", controller.deleteRecord);
};
