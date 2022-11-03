// PROJECT IMPORT
const controller = require("../../controllers/product.controller");
const { validate } = require("../../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../../validate/product.validate");

module.exports = function (app) {
  app.get("/web/v1/product", controller.getList);

  app.get("/web/v1/product/:id", controller.getOne);

  app.get("/web/v1/product/url/:url", controller.getOneByUrl);

  app.get("/web/v1/producer-product", controller.getAllProducerProduct);

  app.post("/web/v1/product", [validate(validateCreate())], controller.create);

  app.put(
    "/web/v1/product/:id",
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/web/v1/product/updateStatus/:id",
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/web/v1/product/:id", controller.deleteRecord);
};
