// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/product.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/product.validate");

module.exports = function (app) {
  app.get("/product", [authJwt.verifyToken], controller.getList);

  app.get(
    "/producer-product",
    [authJwt.verifyToken],
    controller.getAllProducerProduct
  );

  app.get("/product/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/product",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/product/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/product/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/product/:id", [authJwt.verifyToken], controller.deleteRecord);
};
