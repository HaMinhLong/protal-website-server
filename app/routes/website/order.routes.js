// PROJECT IMPORT
const controller = require("../../controllers/order.controller");
const { validate } = require("../../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../../validate/order.validate");

module.exports = function (app) {
  app.get("/web/v1/order", controller.getList);

  app.get("/web/v1/order/:id", controller.getOne);

  app.post("/web/v1/order", [validate(validateCreate())], controller.create);

  app.put(
    "/web/v1/order/:id",
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/web/v1/order/updateStatus/:id",
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/web/v1/order/:id", controller.deleteRecord);
};
