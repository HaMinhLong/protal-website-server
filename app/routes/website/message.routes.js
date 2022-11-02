// PROJECT IMPORT
const controller = require("../../controllers/message.controller");
const { validate } = require("../../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../../validate/message.validate");

module.exports = function (app) {
  app.get("/web/v1/message", controller.getList);

  app.get("/web/v1/message/:id", controller.getOne);

  app.post("/web/v1/message", [validate(validateCreate())], controller.create);

  app.put(
    "/web/v1/message/:id",
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/web/v1/message/updateStatus/:id",
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/web/v1/message/:id", controller.deleteRecord);
};
