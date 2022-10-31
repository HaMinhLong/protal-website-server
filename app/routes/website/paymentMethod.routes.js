// PROJECT IMPORT
const controller = require("../../controllers/paymentMethod.controller");
const { validate } = require("../../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../../validate/paymentMethod.validate");

module.exports = function (app) {
  app.get("/web/v1/paymentMethod", controller.getList);

  app.get("/web/v1/paymentMethod/:id", controller.getOne);

  app.post(
    "/web/v1/paymentMethod",
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/web/v1/paymentMethod/:id",
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/web/v1/paymentMethod/updateStatus/:id",
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/web/v1/paymentMethod/:id", controller.deleteRecord);
};
