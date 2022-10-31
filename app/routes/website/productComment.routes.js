// PROJECT IMPORT
const controller = require("../../controllers/productComment.controller");
const { validate } = require("../../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../../validate/productComment.validate");

module.exports = function (app) {
  app.get("/web/v1/productComment", controller.getList);

  app.get("/web/v1/productComment/:id", controller.getOne);

  app.post(
    "/web/v1/productComment",
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/web/v1/productComment/:id",
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/web/v1/productComment/updateStatus/:id",
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/web/v1/productComment/:id", controller.deleteRecord);
};
