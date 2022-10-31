// PROJECT IMPORT
const controller = require("../../controllers/location.controller");
const { validate } = require("../../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../../validate/location.validate");

module.exports = function (app) {
  app.get("/web/v1/location", controller.getList);

  app.get("/web/v1/location/:id", controller.getOne);

  app.post("/web/v1/location", [validate(validateCreate())], controller.create);

  app.put(
    "/web/v1/location/:id",
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/web/v1/location/updateStatus/:id",
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/web/v1/location/:id", controller.deleteRecord);
};
